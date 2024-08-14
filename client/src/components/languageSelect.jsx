import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LanguageSelect = () => {
    const { i18n } = useTranslation();

    const [language, setLanguage] = useState(i18n.resolvedLanguage);

    const languages = [
        { icon: "https://cdn.pixabay.com/photo/2021/07/30/12/07/flag-6509494__340.png", short: "tr", name: "Türkçe" },
        { icon: "https://img.freepik.com/premium-photo/raster-illustration-usa-flag_483040-7328.jpg?w=2000", short: "en", name: "English" }
    ];

    const handleChange = (value) => {
        setLanguage(value);
        i18n.changeLanguage(value)
    };

    return (
        <Select
            value={language}
            onValueChange={(value) => {
                handleChange(value)
            }}>
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={language.name} />
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