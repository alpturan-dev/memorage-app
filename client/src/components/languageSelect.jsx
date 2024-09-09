import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LanguageSelect = ({ language, handleLanguageChange, disabled }) => {
    const languages = [
        { icon: "https://cdn.pixabay.com/photo/2021/07/30/12/07/flag-6509494__340.png", short: "tr", name: "Türkçe" },
        { icon: "https://img.freepik.com/premium-photo/raster-illustration-usa-flag_483040-7328.jpg?w=2000", short: "en", name: "English" }
    ];

    const handleChange = (value) => {
        handleLanguageChange(value);
    };

    return (
        <Select
            value={language}
            disabled={disabled}
            onValueChange={(value) => {
                handleChange(value)
            }}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={languages.find((item) => item.short === language).name} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {languages.map((language, index) => (
                        <SelectItem key={index} value={language.short}>{language.name}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default LanguageSelect