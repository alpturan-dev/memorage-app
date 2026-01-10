import { WordCollection } from "../models/WordCollectionModel.js";
import { Word } from "../models/WordModel.js";
import { User } from "../models/UserModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user for streak data
    const user = await User.findById(userId).lean();

    // Get all user collections
    const collections = await WordCollection.find({ user: userId })
      .sort({ updatedAt: -1 })
      .lean();

    const totalCollections = collections.length;

    // Get word counts per collection
    const collectionIds = collections.map(c => c._id);
    const wordCounts = await Word.aggregate([
      { $match: { wordCollection: { $in: collectionIds } } },
      { $group: { _id: "$wordCollection", count: { $sum: 1 } } }
    ]);

    const wordCountMap = {};
    wordCounts.forEach(wc => {
      wordCountMap[wc._id.toString()] = wc.count;
    });

    // Calculate total words
    const totalWords = wordCounts.reduce((sum, wc) => sum + wc.count, 0);

    // Get unique languages being learned
    const languagesLearning = [...new Set(
      collections.map(c => c.targetLanguage?.name).filter(Boolean)
    )];

    // Get recent collections (last 3) with word counts
    const recentCollections = collections.slice(0, 3).map(c => ({
      _id: c._id,
      name: c.name,
      targetLanguage: c.targetLanguage,
      wordCount: wordCountMap[c._id.toString()] || 0,
      updatedAt: c.updatedAt
    }));

    // Calculate streak
    const streak = calculateStreak(user);

    // Get random word of the day (from user's collections)
    const wordOfTheDay = await getWordOfTheDay(collectionIds);

    // Get activity data for chart (last 7 days based on collection updates)
    const activityChart = await getActivityChart(userId, collectionIds);

    res.json({
      totalWords,
      totalCollections,
      recentCollections,
      languagesLearning,
      streak,
      wordOfTheDay,
      activityChart
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Update user streak when they perform an activity
export const recordActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('streak').lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user?.streak?.lastActivityDate
      ? new Date(user.streak.lastActivityDate)
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
    }

    let newStreak = user?.streak?.current || 0;

    if (!lastActivity) {
      // First activity ever
      newStreak = 1;
    } else {
      const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already active today, keep streak
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }

    // Use findByIdAndUpdate to avoid triggering pre-save hooks
    await User.findByIdAndUpdate(userId, {
      streak: {
        current: newStreak,
        lastActivityDate: new Date()
      }
    });

    res.json({ streak: newStreak });
  } catch (error) {
    res.status(500).json({ message: 'Error recording activity', error: error.message });
  }
};

function calculateStreak(user) {
  if (!user?.streak?.lastActivityDate) {
    return { current: 0, isActiveToday: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(user.streak.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { current: user.streak.current, isActiveToday: true };
  } else if (diffDays === 1) {
    return { current: user.streak.current, isActiveToday: false };
  } else {
    // Streak is broken
    return { current: 0, isActiveToday: false };
  }
}

async function getWordOfTheDay(collectionIds) {
  if (collectionIds.length === 0) return null;

  // Use today's date as seed for consistent daily word
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const totalWords = await Word.countDocuments({ wordCollection: { $in: collectionIds } });
  if (totalWords === 0) return null;

  const skipCount = seed % totalWords;

  const word = await Word.findOne({ wordCollection: { $in: collectionIds } })
    .skip(skipCount)
    .populate('wordCollection', 'name targetLanguage')
    .lean();

  if (!word) return null;

  return {
    nativeWord: word.nativeWord,
    targetWord: word.targetWord,
    collectionName: word.wordCollection?.name,
    targetLanguage: word.wordCollection?.targetLanguage
  };
}

async function getActivityChart(userId, collectionIds) {
  const days = [];
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Get word counts per day for the last 7 days
  const wordsByDay = await Word.aggregate([
    {
      $match: {
        wordCollection: { $in: collectionIds },
        createdAt: { $gte: sevenDaysAgo, $lte: today }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    }
  ]);

  const countMap = {};
  wordsByDay.forEach(item => {
    countMap[item._id] = item.count;
  });

  // Find max count for normalization
  const maxCount = Math.max(...wordsByDay.map(d => d.count), 1);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = countMap[dateStr] || 0;

    days.push({
      date: dateStr,
      dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count,
      percentage: maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
    });
  }

  return days;
}
