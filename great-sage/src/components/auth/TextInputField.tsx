import React from 'react';
import eyeIcon from '../../icons/eye_light.svg';
import eyeOffIcon from '../../icons/eye_off_light.svg';


export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password',
}

interface TextInputFieldProps {
    type: InputType;
    prefixIcon: string;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    placeholderText?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ type, prefixIcon, text, setText, placeholderText="" }) => {
    const [inputType, setInputType] = React.useState<InputType>(type);

    return (
        <>
            <div className="form-group">
                <img
                    src={prefixIcon}
                    alt="prefix-icon"
                    height='30px'
                    width='30px'
                />

                <input
                    type={inputType}
                    className='input-field'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholderText}
                />

                {
                    type === InputType.PASSWORD &&
                    <img
                        src={inputType === InputType.PASSWORD ? eyeIcon : eyeOffIcon}
                        alt="suffix-icon"
                        height='30px'
                        width='30px'
                        onClick={(e) => setInputType(prev => prev === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD)}
                    />
                }
            </div>

        </>
    );
};

export default TextInputField;