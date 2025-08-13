// import { useEffect, useState } from "react";
// import { listProcess, processRequest, 
//         processDetail, createTrack } from "../../apis/process";
// import "reactflow/dist/style.css";
// import DynamicFormPopup from "../../components/Modal/DynamicForm";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   CircularProgress,
//   Box, // Import Box for layout management
//   IconButton,
// } from "@mui/material";
// import toast from "react-hot-toast";
// import { Loading } from "../../components/Loading/Loading";
// import { HelpOutline } from "@mui/icons-material";

// export function ProcessList() {
//   const [processes, setProcesses] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openForm, setOpenForm] = useState(false);
//   const [selectedProcessId, setSelectedProcessId] = useState<
//     undefined | string
//   >(undefined);
//   const [isLoading, setLoading] = useState(false);
//   const [formData, setformData] = useState([]);
//   const [nodeId, setNodeId] = useState('');
//   const [actionList, setactionList] = useState([]);

//   async function startProcess() {
//     console.log("selectedProcessId: ", selectedProcessId);
//     setOpenDialog(false);
//     setLoading(true);
//     try {
//       const data: any = await processRequest({ process: selectedProcessId });
//       toast.success(data);
//     } catch (err) {
//       console.log(err);
//       toast.error("Process start failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const getProcessDetail = async (processId: string) => {
//     try {
//       if (!processId) {
//         throw new Error("Process ID is not selected");
//       }
  
//       const processData: any = await processDetail(processId); // Pass only the ID if expected
//       console.log("processData: ", processData);
//       if(!processData.on_confirmation){
//         console.log("on confirm");
//         setOpenForm(true);
//         setformData(processData.form.form_data);
//         setactionList(processData.action);
//         setNodeId(processData.form.node_uuid);
//       }else{
//         console.log("not on confirm");
//         setOpenDialog(true);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error("Process details get error");
//     }
//   };

//   const onClose = () => {
//     setOpenForm(false);
//   };

//   const createTrackOnSubmit = async (formState: {}, selectedAction:  string) => {
//     if (selectedProcessId) {
//       try {
//         const data = await createTrack(selectedProcessId, selectedAction, nodeId, formState);
//         setOpenForm(false);
//         toast.success(data);
//       } catch (err) {
//         console.log(err);
//         toast.error("Process start failed");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
  

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await listProcess();
//         setProcesses(data);
//       } catch (error) {}
//     })();
//   }, []);

//   return (
//     <>
//       <Typography variant="h4" gutterBottom align="center">
//         {/* Process Automations */}
//       </Typography>

//       <div className="container">
//         <Grid container spacing={3} m={2} justifyContent="flex-start">
//           {isLoading ? (
//             <CircularProgress />
//           ) : (
//             processes.map((process: any, index: number) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 lg={3}
//                 key={index}
//                 sx={{ marginBottom: 3 }}
//               >
//                 <Card
//                   className="process-card"
//                   sx={{
//                     height: "100%", // Make sure all cards are the same height
//                     boxShadow: 3, // Slight elevation by default
//                     transition: "0.3s", // Smooth transition for hover
//                     "&:hover": {
//                       boxShadow: 6, // Increased shadow on hover
//                       backgroundColor: "#f0f0f0", // Lighter background on hover
//                     },
//                   }}
//                 >
//                   <CardContent>
//                     <Box sx={{ position: "relative" }}>
//                       <Typography variant="h6" component="div">
//                         {process.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {process.description}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
//                         {/* {process.category || ""} */}
//                       </Typography>

//                       <IconButton
//                         size="small"
//                         color="primary"
//                         sx={{
//                           position: "absolute", // Positioned relative to the Box
//                           top: 0,
//                           right: 0,
//                         }}
//                         href={`/help/${process.uuid}`}
//                       >
//                         <HelpOutline />
//                       </IconButton>
//                     </Box>
//                   </CardContent>
//                   <CardActions>
//                     <Box sx={{ display: "flex", width: "100%" }}>
//                       <Button
//                         size="small"
//                         color="primary"
//                         sx={{ textTransform: "uppercase" }}
//                         onClick={() => {
//                           setSelectedProcessId(process.uuid);
//                           getProcessDetail(process.uuid);
//                           // setOpenDialog(true);
//                         }}
//                       >
//                         Start Process
//                       </Button>
//                       <Box sx={{ flexGrow: 1 }} />
//                       <Button
//                         size="small"
//                         color="secondary"
//                         sx={{ textTransform: "uppercase" }}
//                         onClick={() => { console.log("process.documents") }}
//                       >
//                         Required Documents
//                       </Button>
//                     </Box>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))
//           )}
//         </Grid>
//       </div>
//       {openForm && (
//         <DynamicFormPopup 
//         formData={formData}
//         actionList={actionList}
//         onClose={() => setOpenForm(false)}
//         onSubmit={createTrackOnSubmit}/>
//       )}
      
//       <Dialog open={openDialog}>
//         <DialogContent>
//           <Typography variant="h5">
//             Are you sure you want to start the process?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button variant="outlined" onClick={() => setOpenDialog(false)}>
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={startProcess}>
//             Ok
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// export default ProcessList;


export {}