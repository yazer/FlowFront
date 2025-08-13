import React, { useState } from 'react';
import './inboxDetail.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

type InboxDetail = {
  node_name: string;
  is_completed: boolean;
  form_data: Array<FormDataItem>;
  actions: Array<ActionItem>;
};

// Type for Common Data
type CommonData = {
  [key: string]: any;
};

// Type for each Historic Data item
type HistoricDataItem = {
  [key: string]: any; // Each item in the historicData is an object with key-value pairs
};

type FormDataItem = {
  input_type?: string;
  title?: string;
  label?: string;
  placeholder?: string;
  val?: string;
  attachment_url?: string;
  options?: string[]; // Added for options in dropdown
  [key: string]: any;
};

type ActionItem = {
  label: string;
  is_completed: boolean;
};

type Props = {
  selectedInboxDetails: InboxDetail | null;
  commonData: CommonData;
  historicData: HistoricDataItem[];
  selected: boolean;
  handleAction: (action: ActionItem) => void;
};

const EmailDetailCard: React.FC<Props> = ({ 
  selectedInboxDetails, 
  commonData, 
  historicData, 
  selected, 
  handleAction 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // State to manage collapse for each historic data item
  const [historicCollapseState, setHistoricCollapseState] = useState<boolean[]>(
    historicData.map(() => false)
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleHistoricCollapse = (index: number) => {
    const newCollapseState = [...historicCollapseState];
    newCollapseState[index] = !newCollapseState[index];
    setHistoricCollapseState(newCollapseState);
  };

  const fileUploadCount =
    selectedInboxDetails?.form_data?.filter((item: FormDataItem) => item.input_type === 'FILE_UPLOAD').length || 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedAction) {
      const actionItem = selectedInboxDetails?.actions?.find((action) => action.label === selectedAction);
      if (actionItem) handleAction(actionItem);
    }
  };

  return (
    <>
      {selected && selectedInboxDetails && (
        <div className="w-11/12 bg-white shadow-lg rounded-lg overflow-hidden m-5">
          <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b">
            <div className="flex items-center">
              <h2 className="font-bold text-lg text-gray-900">
                {selectedInboxDetails.node_name || 'Node Name'}
              </h2>

              {fileUploadCount > 0 && (
                <div className="ml-4 flex items-center text-sm text-gray-700">
                  <i className="fas fa-paperclip text-blue-500 mr-2"></i>
                  <span className="text-blue-600 font-medium">
                    {fileUploadCount} attachment{fileUploadCount > 1 ? 's' : ''} required
                  </span>
                </div>
              )}
            </div>

            <button onClick={toggleCollapse} className="text-blue-400 hover:text-blue-800 focus:outline-none">
              <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
            </button>
          </div>

          {!isCollapsed && (
            <div className="px-5 py-5">
              <div className="m-8 flex justify-center items-center">
                <div className="w-full max-w-2xl space-y-4">
                  {selectedInboxDetails.is_completed ? (
                    <div className="space-y-4">
                      {selectedInboxDetails.form_data?.map((item, index) => (
                        <div key={index}>
                          {item.input_type === 'TITLE' && (
                            <h2 className="font-bold text-center text-xl text-black mb-2">{item.val}</h2>
                          )}
                          {item.input_type === 'TEXT_FIELD' && (
                            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                              <p className="font-bold w-1/3 text-sm">{item.label}:</p>
                              <p className="w-2/3 text-sm">{item.val || 'No value provided'}</p>
                            </div>
                          )}
                          {item.input_type === 'FILE_UPLOAD' && (
                            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                              <p className="font-bold w-1/3 text-sm">{item.label}:</p>
                              {item.val && (
                                <a
                                  href={item.val}  // The URL to the uploaded file
                                  target="_blank"  // Open in a new tab
                                  rel="noopener noreferrer"  // For security reasons
                                  className="ml-4 text-blue-600 hover:underline"
                                >
                                  View Attachment
                                </a>
                              )}
                            </div>
                          )}
                          {item.input_type === 'CHECKBOX' && (
                            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                              <p className="font-bold w-1/3 text-sm">{item.label}:</p>
                              <p className="w-2/3 text-sm">{item.val || 'No value provided'}</p>
                            </div>
                          )}
                          {item.input_type === 'RADIO_BUTTON' && (
                            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                              <p className="font-bold w-1/3 text-sm">{item.label}:</p>
                              <p className="w-2/3 text-sm">{item.val || 'No value provided'}</p>
                            </div>
                          )}
                          {item.input_type === 'DROPDOWN' && (
                            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                              <p className="font-bold w-1/3 text-sm">{item.label}:</p>
                              <p className="w-2/3 text-sm">{item.val || 'No value provided'}</p>
                            </div>
                          )}
                          {item.input_type === 'DATE' && (
                            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                              <p className="font-bold w-1/3 text-sm">{item.label}:</p>
                              <p className="w-2/3 text-sm">{item.val || 'No value provided'}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedInboxDetails.form_data?.map((item, index) => (
                        <div key={index}>
                          {item.input_type === 'TITLE' && (
                            <h2 className="font-bold text-center text-xl text-black mb-2">{item.title}</h2>
                          )}
                          {item.input_type === 'TEXT_FIELD' && (
                            <div className="flex items-center space-x-4">
                              <label className="w-1/4 text-sm font-medium text-gray-700">{item.label}</label>
                              <input
                                type="text"
                                name={item.id}
                                placeholder={item.placeholder || 'Enter value'}
                                className="w-3/4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow shadow-sm"
                              />
                            </div>
                          )}
                          {item.input_type === 'FILE_UPLOAD' && (
                            <div className="flex items-center space-x-4">
                              <label className="w-1/4 text-sm font-medium text-gray-700">{item.label}</label>
                              <input
                                type="file"
                                name={item.id}
                                className="w-3/4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow shadow-sm"
                              />
                            </div>
                          )}
                          {item.input_type === 'CHECKBOX' && (
                            <div className="flex items-center space-x-4">
                              <label className="w-1/4 text-sm font-medium text-gray-700">{item.label}</label>
                              <input
                                name={item.id}
                                type="checkbox"
                                className="w-5 h-5 text-blue-500 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow shadow-sm"
                              />
                            </div>
                          )}
                          {item.input_type === 'DROP_DOWN' && (
                            <div className="flex items-center space-x-4">
                              <label className="w-1/4 text-base font-medium text-gray-700">{item.label}</label>
                              <select name={item.id} className="w-3/4 p-2 border border-gray-300 rounded-lg">
                                {item.options?.map((option: string, optionIndex: number) => (
                                  <option key={optionIndex} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      






        

<div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Historic Data</h3>
                {historicData.map((item, index) => (
                  <div key={index} className="border-b py-4">
                    <button
                      onClick={() => toggleHistoricCollapse(index)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <i className={`fas fa-chevron-${historicCollapseState[index] ? 'down' : 'up'}`}></i> 
                      Historic Data Item {index + 1}
                    </button>

                    {historicCollapseState[index] && (
                      <div className="mt-4">
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
    </>
  );
};

export default EmailDetailCard;
