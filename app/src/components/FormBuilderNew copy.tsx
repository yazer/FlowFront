// import { useState, useEffect, useRef } from "react";
// import FormElements from "./FormElements/FormElements";
// import Title from "./FormElements/newcompnents/Title";
// import TextField from "./FormElements/newcompnents/TextField";
// import FileInput from "./FormElements/newcompnents/FileInput";
// import FormCheckBox from "./FormElements/newcompnents/CheckBox";
// import DropDown from "./FormElements/newcompnents/DropDown";
// import { createForm, getFormByNodeId } from "../apis/flowBuilder";

// interface FormBuilderNewProps {
//   selectedNode: any;
//   onClose: () => void;
// }

// interface FormField {
//   id: number;
//   type: string;
//   label: string;
//   placeholder: string;
//   element_type: string;
//   input_type: string;
//   title: string;
//   options: any;
// }

// const FormBuilderNew = (props: FormBuilderNewProps) => {
//   const { selectedNode } = props;
//   const [formFields, setFormFields] = useState<FormField[]>([]);

//   // Ref to store the previous state
//   const prevFormFieldsRef = useRef<FormField[]>([]);

//   const handleDrop = (ev: React.DragEvent) => {
//     ev.preventDefault();
//     const elementType = ev.dataTransfer.getData("type");

//     if (elementType) {
//       console.log("Dropped element:", elementType);

//       const newField: FormField = {
//         id: Date.now(), // Unique ID based on current timestamp
//         title: "",
//         type: elementType,
//         label: "",  // Default label
//         placeholder: "",  // Default placeholder
//         element_type: "INP",  // Default element type (can change based on type)
//         input_type: elementType,  // Assuming elementType is the same as input_type for now
//         options: []
//       };

//       setFormFields(prevFields => [...prevFields, newField]);
//     }
//   };

//   const handleDragOver = (ev: React.DragEvent) => {
//     ev.preventDefault();
//     ev.dataTransfer.dropEffect = "move"; // Indicate a move effect for better user experience
//   };

//   // Save form function
//   const saveForm = () => {
//     console.log("SAVE CALLED with fields:", formFields);
//     createForm(selectedNode.id, formFields); // Save form with current fields (can be empty)
//   };

//   // Check for changes before saving
//   useEffect(() => {
//     // Only call saveForm if the formFields have changed
//     if (JSON.stringify(prevFormFieldsRef.current) !== JSON.stringify(formFields)) {
//       saveForm(); // Call save if there's a change
//       prevFormFieldsRef.current = formFields; // Update the ref to the current state
//     }
//   }, [formFields]); // Effect runs whenever formFields change

//   const handleDeleteField = (fieldId: number) => {
//     const updatedFormFields = formFields.filter(f => f.id !== fieldId);
//     setFormFields(updatedFormFields); // Automatically triggers saveForm through useEffect
//   };

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const response = await getFormByNodeId(`${selectedNode.id}`);

//         if (response) {
//           setFormFields(response);
//           console.log("Form fields fetched:", response);
//         } else {
//           console.log("No response from server");
//           setFormFields([]);  // Set empty fields if no response
//         }
//       } catch (error) {
//         console.error("Error fetching form:", error);
//         setFormFields([]);  // Handle errors by setting empty fields
//       }
//     };

//     fetchForm();
//   }, [selectedNode.id]);

//   return (
//     <div className="w-full h-[calc(100vh_-_4rem)] flex flex-col">
//       <div className="flex-grow flex border border-gray-300 overflow-hidden">
//         <div
//           className="flex-grow-[3] flex flex-col bg-white border-r border-gray-300 shadow-lg"
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//         >
//           <div className="p-3 bg-gray-100 shadow-sm">
//             <div className="flex flex-row justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">{selectedNode.data.label}</h2>
//               <button className="text-white bg-[#0060AB] px-3 py-1 rounded hover:bg-[#004d8c] transition">
//                 Preview
//               </button>
//             </div>
//           </div>

//           <div className="flex-grow p-4 overflow-auto space-y-4">
//             {formFields.length === 0 ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="text-center">
//                   <svg className="mx-auto mb-4 w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10m0 0a2 2 0 002 2h12a2 2 0 002-2V7m-16 0a2 2 0 012-2h12a2 2 0 012 2v10m-16 0V7m0 10h16"></path>
//                   </svg>
//                   <p className="text-lg text-gray-500">Drag elements here to build your form</p>
//                 </div>
//               </div>
//             ) : (
//               formFields.map((field, index) => (
//                 field.type === "TITLE" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     <Title
//                       title={field.title}
//                       placeholder={field.placeholder}
//                       onDelete={() => handleDeleteField(field.id)} // Handle field deletion
//                       onChange={(value) => {
//                         console.log(value);
//                       }}
//                       onBlur={(value) => {
//                         setFormFields(formFields.map(f => f.id === field.id ? { ...f, title: value } : f));
//                       }}
//                     />
//                   </div>
//                 ) : field.type === "TEXT_FIELD" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                    <TextField
//                       label={field.label}
//                       placeholder={field.placeholder}
//                       onDelete={() => handleDeleteField(field.id)}
//                       onBlur={(value, value_type) => {
//                         setFormFields(formFields.map(f => f.id === field.id ? { ...f, [value_type]: value } : f));
//                       }}
//                     />
//                   </div>
//                 ) : field.type === "CHECKBOX" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     <FormCheckBox
//                         label={field.label}
//                         onDelete={() => handleDeleteField(field.id)}
//                         onBlur={(value, value_type) => {
//                           setFormFields(formFields.map(f => f.id === field.id ? { ...f, [value_type]: value } : f));
//                       }}
//                     />
//                   </div>
//                 ) : field.type === "RADIO" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     {/* <Radio
//                       label={field.label}
//                       onDelete={() => handleDeleteField(field.id)}
//                     /> */}
//                   </div>
//                 ) : field.type === "SELECT" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     {/* <Select
//                       label={field.label}
//                       onDelete={() => handleDeleteField(field.id)}
//                     /> */}
//                   </div>
//                 ) : field.type === "DATE" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     {/* <Date
//                       label={field.label}
//                       onDelete={() => handleDeleteField(field.id)}
//                     /> */}
//                   </div>
//                 ) : field.type === "FILE_UPLOAD" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     <FileInput
//                       label={field.label}
//                       onDelete={() => handleDeleteField(field.id)}
//                       onBlur={(value) => {
//                         setFormFields(formFields.map(f => f.id === field.id ? { ...f, label: value } : f));
//                       }}
//                       // onChange={() => handleDeleteField(field.id)}
//                     />
//                   </div>
//                 ): field.type === "DROP_DOWN" ? (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
//                     <DropDown
//                       label={field.label}
//                       onDelete={() => handleDeleteField(field.id)}
//                       options={field.options}
//                       onBlur={(value) => {
//                         setFormFields(formFields.map(f => f.id === field.id ? { ...f, label: value } : f));
//                       }}
//                       // onChange={() => handleDeleteField(field.id)}
//                     />
//                   </div>
//                 ):
//                 (
//                   <div key={field.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
//                     <p>Not implemented</p>
//                   </div>
//                 )
//               ))
//             )}
//           </div>
//         </div>

//         <div className="min-w-[250px] bg-gray-50 border-l border-gray-300 p-4 overflow-auto">
//           <FormElements />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormBuilderNew;

export {};
