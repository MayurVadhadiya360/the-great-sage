import React from 'react';
import upArrowIcon from '../../icons/up-arrow.svg';
import chevronUpIcon from '../../icons/chevron_up.svg';
import chevronDownIcon from '../../icons/chevron_down.svg';
import { useAppContext } from '../../App';

type UserMsgFieldProps = {
   userMessage: string;
   currentModel: string;
   setUserMessage: React.Dispatch<React.SetStateAction<string>>;
   setCurrentModel: React.Dispatch<React.SetStateAction<string>>;
   onSubmit: () => void;
}

const UserMsgField: React.FC<UserMsgFieldProps> = ({ userMessage, setUserMessage, currentModel, setCurrentModel, onSubmit }) => {
   const { llmModels } = useAppContext();
   const [showModelDropdown, setShowModelDropdown] = React.useState(false);
   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserMessage(e.target.value);
      const valLinesCount = e.target.value.split('\n').length;
      if (valLinesCount < 7 && valLinesCount > 0) {
         e.target.rows = valLinesCount;
      }
   };

   return (
      <div className='chat-input-container'>
         <div className='dropdown-button-container'>
            {showModelDropdown &&
               <div className='model-dropdown'>
                  {
                     llmModels.map((provider, index) => (
                        <div key={`${provider.provider}${index}`}>
                           <div className='provider-name'>
                              {provider.provider}
                           </div>
                           <div className='models-name'>
                              {
                                 provider.models.map((model, i) => (
                                    <div
                                       key={`${index}${i}`}
                                       className={`model-name ${currentModel === model ? 'active' : ''} `}
                                       onClick={(e) => setCurrentModel(model)}
                                    >
                                       {model}
                                    </div>
                                 ))
                              }
                           </div>

                        </div>
                     ))
                  }
               </div>
            }
            <div className='dropdown-button' onClick={(e) => setShowModelDropdown(prev => !prev)}>
               <img src={showModelDropdown? chevronDownIcon : chevronUpIcon} alt='select-model' height='40px' width='40px' />
            </div>
         </div>

         <textarea
            className='user-message'
            name='user-message'
            id='user-message'
            placeholder='Message The Great Sage'
            rows={1}
            value={userMessage}
            onChange={handleChange}
         />

         <div
            className='send-button'
            onClick={(e) => onSubmit()}
         >
            <img src={upArrowIcon} alt='submit' height='40px' width='40px' />
         </div>
      </div>
   );
};

export default UserMsgField;
