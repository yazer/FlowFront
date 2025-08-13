// import React, { useState } from 'react';
// import './inboxDetail.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// type InboxDetail = {
//   node_name: string;
//   completed: boolean; // Add `completed` status at the root of each form
//   form_data: Array<FormDataItem>;
//   actions: Array<ActionItem>;
// };

// type FormDataItem = {
//   input_type?: string;
//   title?: string;
//   label?: string;
//   placeholder?: string;
//   // Include fields to handle the key-value pairs when `completed` is true
//   [key: string]: any;
// };

// type ActionItem = {
//   label: string;
//   completed: boolean;
// };

// type Props = {
//   selectedInboxDetails: InboxDetail | null;
//   selected: boolean;
//   handleAction: (action: ActionItem) => void;
// };

// const EmailDetailCard: React.FC<Props> = ({ selectedInboxDetails, selected, handleAction }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <>
//       {selected && selectedInboxDetails && (
//         <div className="w-11/12 bg-white shadow-lg rounded-lg overflow-hidden m-5">
//           {/* Card Header with node_name on the left, Icons, and Collapse Button on Right */}
//           <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b">
//             <div className="flex items-center">
//               <h2 className="font-bold text-lg">{selectedInboxDetails.node_name || 'Node Name'}</h2>
//             </div>

//             <div className="flex space-x-4">
//               {/* Collapse/Expand Button */}
//               <button onClick={toggleCollapse} className="text-blue-400 hover:text-blue-800 focus:outline-none">
//                 <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`}></i>
//               </button>
//             </div>
//           </div>

//           {/* Conditionally render the content based on the collapse state */}
//           {!isCollapsed && (
//             <div className="px-5 py-5">
//               <div className="m-8">
//                 <div className="w-full space-y-6">
//                   {selectedInboxDetails.completed ? (
//                     /* When completed, show key-value pairs */
//                     <div className="space-y-4">
//                       {selectedInboxDetails.form_data.map((item, index) => (
//                         <div key={index} className="bg-gray-100 p-4 rounded-lg">
//                           {Object.entries(item).map(([key, value]) => (
//                             <p key={key} className="text-sm">
//                               <span className="font-bold">{key}:</span> {value}
//                             </p>
//                           ))}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     /* Show form inputs if not completed */
//                     <div className="w-full space-y-6">
//                       {selectedInboxDetails.form_data?.map((item: FormDataItem, index: number) => {
//                         switch (item.input_type) {
//                           case 'TITLE':
//                             return (
//                               <h2 key={index} className="font-bold text-center text-xl text-black mb-4">
//                                 {item.title}
//                               </h2>
//                             );
//                           case 'TEXT_FIELD':
//                             return (
//                               <div key={index} className="flex items-center mb-6">
//                                 <label className="w-1/3 text-sm font-medium text-gray-700 text-right pr-4">
//                                   {item.label}
//                                 </label>
//                                 <input
//                                   type="text"
//                                   placeholder={item.placeholder || 'Enter value'}
//                                   className="w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow shadow-sm"
//                                 />
//                               </div>
//                             );
//                           default:
//                             return null;
//                         }
//                       })}

//                       {/* Action Buttons Section */}
//                       <div className="mt-6">
//                         <h4 className="font-bold text-center text-lg mb-4">Actions</h4>
//                         <div className="flex justify-center space-x-4">
//                           {selectedInboxDetails.actions?.map((item: ActionItem, index: number) => (
//                             <button
//                               key={index}
//                               onClick={() => handleAction(item)}
//                               disabled={item?.completed}
//                               type="button"
//                               className={`py-3 px-6 text-sm font-medium text-white 
//                                 ${item.completed ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} 
//                                 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200`}
//                             >
//                               {item?.label}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default EmailDetailCard;

export {}