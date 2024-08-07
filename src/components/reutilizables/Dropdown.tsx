import { useState, useEffect, useRef } from "react";

interface Option {
    label: string
    value: string | number | undefined
}

const Dropdown = ({ onSelect, options, divStyles, buttonStyles } : 
    { onSelect: (option: Option["value"] | null) => void, 
        options: ({ label: string, value: string | number })[],
        divStyles?: string,
        buttonStyles?: string,
    }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: Option | null) => {
        setSelectedOption(option);
        onSelect(option?.value);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`${divStyles} relative`} ref={dropdownRef}>
            <button
                className={`${buttonStyles} flex justify-between items-center`}
                onClick={handleToggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby="dropdown-label"
                type="button"
            >
                <h3>
                    {selectedOption?.label ?? "Seleccione una opción"}
                </h3>
                <span>
                    <svg
                        className={`w-7 h-7 duration-200 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/>
                    </svg>
                </span>
            </button>

            {isOpen && (
                <ul className="absolute w-full space-y-1 pt-1 px-2 pb-2 bg-slate-50 shadow-md" 
                role="listbox" 
                aria-labelledby="dropdown-label"
                >
                    <li onClick={() => handleOptionClick(null)} hidden={selectedOption?.value === null} className="py-1 cursor-pointer">
                        Seleccione una opción
                    </li>
                    {options.map((option, index) => (
                        <li className="cursor-pointer" key={index} onClick={() => handleOptionClick(option)}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
