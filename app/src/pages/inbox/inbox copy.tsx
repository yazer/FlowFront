// import { useCallback, useEffect, useState } from "react";
// import { useLocation } from 'react-router-dom';
// import { inboxDetails, listInbox, updateTrack } from "../../apis/inbox";
// import EmailDetailCard from "./inboxDetail";
// import { Button } from "../../components/Button/Button";
// import { Dialog, DialogActions, DialogContent, DialogContentText, Typography } from "@mui/material";
// import Input from "../../components/Input/Input";
// import { MdOutlineSearch, MdFilterList } from "react-icons/md";

// export function Inbox(category: any) {
//   const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(1);
//   const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
//   const [selected, setSelected] = useState<any>(null);
//   const [inboxList, setInboxList] = useState<any>([]);
//   const [selectedInboxDetails, setSelectedInboxDetails] = useState<any>({});
//   const [dialog, setDialog] = useState(false);
//   const [dialogItem, setDialogItem] = useState<any>(null); 
//   const [actionId, setActionId] = useState<any>(null); 

//   const location = useLocation();

//   const handleOpen = () => setDialog(true);
//   const handleClose = () => setDialog(false);

//   const handleTriggerAction = async () => {
//     const formData: any = {};
//     const formFields = document.querySelectorAll('.px-5 input');
  
//     formFields.forEach((inputField: any) => {
//       const fieldLabel = inputField.previousElementSibling?.innerText;
//       if (fieldLabel) {
//         formData[fieldLabel] = inputField.value;
//       }
//     });
  
//     try {
//       formData['uuid'] = actionId;
//       formData['in_uuid'] = selectedInboxDetails.in_uuid;
//       console.log("formData: ", formData);
//       const result = await updateTrack(formData);
//       console.log("Process tracked successfully:", result);
//       handleClose();
//     } catch (error) {
//       console.error("Failed to track process:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("Category: ", category.category);
//     getInboxList();
//   }, [category.category]);

//   const getInboxList = async () => {
//     try {
//       const data = await listInbox(category.category);
//       setInboxList(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getInboxDetails = async (id: any, display: boolean = true) => {
//     try {
//       const data = await inboxDetails(id);
//       console.log("display: ", display);
//       setSelectedInboxDetails(data);
//       console.log("selectedInboxDetails: ", selectedInboxDetails);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleInboxItemClick = (section: any) => {
//     setActiveSectionIndex(section.uuid);
//     setSelected(section);
//     getInboxDetails(section.uuid, location.state?._display || false); // Pass _display if available
//   };

//   const handleAction = (item: any) => {
//     setDialogItem(item);
//     setActionId(item.uuid);
//     setDialog(true);
//   };

//   return (
//     <div className="flex flex-row h-full">
//       <div className="border-r border-gray-200 min-w-[310px]">
//         <div className="p-4 flex flex-row items-center border-b">
//           <Input
//             name="search"
//             onChange={() => {}}
//             placeHolder="Search"
//             prepend={<MdOutlineSearch size={25} />}
//           />
//           <button className="hover:bg-gray-300 ml-4 p-1 rounded-md">
//             <MdFilterList size={25} />
//           </button>
//         </div>

//         <div className="inbox-container">
//           {Array.isArray(inboxList) &&
//             inboxList?.map((section: any, index: any) => (
//               <div
//                 key={section?.uuid}
//                 className={`inbox-item ${activeSectionIndex === index ? 'active' : ''}`}
//                 onClick={() => handleInboxItemClick(section)}
//               >
//                 <div className="inbox-item-content">
//                   <div className="inbox-item-details">
//                     <span className="inbox-item-label">{section?.process_name}</span>
//                     <span className="inbox-item-time">{section?.request_id}</span>
//                     <span className="inbox-item-date">{section?.updated_at_date}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
      
//       <div className="w-full">
//         <div className="w-full border-b p-5">
//           {selected && (
//             <div className="flex">
//               <div className="px-2 overflow-hidden justify-center">
//                 <img
//                   src={"https://i.pravatar.cc/300"}
//                   width={35}
//                   height={35}
//                   alt="icon"
//                   className="rounded-full"
//                 />
//               </div>
//               <div>
//                 <Typography variant="h5">{selected?.process_name}</Typography>
//                 <Typography variant="caption">
//                   Request Id: {`${selected?.request_id} | ${selected?.updated_at_date}`}
//                 </Typography>
//               </div>
//             </div>
//           )}
//         </div>

//         {selected && !location.state?._display(
//           <EmailDetailCard
//             selectedInboxDetails={selectedInboxDetails}
//             selected={selected}
//             handleAction={handleAction}
//           />
//         )}
//       </div>

//       <Dialog open={dialog} onClose={handleClose}>
//         <DialogContent>
//           <DialogContentText>
//             {dialogItem && !dialogItem.completed
//               ? "Are you sure you want to trigger with this action?"
//               : "This action is already triggered."}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           {dialogItem && !dialogItem.completed && (
//             <Button onClick={handleTriggerAction}>Confirm</Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

export {}