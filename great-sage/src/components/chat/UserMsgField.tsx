import React from 'react';
import upArrowIcon from '../../icons/up-arrow.svg';
import threeDotsIcon from '../../icons/3-dots-icon-40.svg';
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

   const resetTextAreaRows = () => {
      const textArea = document.getElementById('user-message') as HTMLTextAreaElement | null;
      if (textArea) {
         textArea.rows = 1;
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
               <img src={threeDotsIcon} alt='select-model' height='40px' width='40px' />
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
            onKeyDown={(e) => {
               if ((e.key === 'Enter' && userMessage.trim() !== '') && (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey)) {
                  e.preventDefault();
                  onSubmit();
                  resetTextAreaRows();
               }
            }}
         />

         <div
            className='send-button'
            onClick={(e) => {
               if (userMessage.trim() !== '') {
                  onSubmit();
                  resetTextAreaRows();
               }
            }}
         >
            <img src={upArrowIcon} alt='submit' height='40px' width='40px' />
         </div>
      </div>
   );
};

export default UserMsgField;
