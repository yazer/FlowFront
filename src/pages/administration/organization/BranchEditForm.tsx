// import { Formik, Form, FieldArray, FormikProps } from "formik";
// import * as Yup from "yup";
// import { Box, Button, Grid } from "@mui/material";
// import InputField from "../../../components/FormElements/newcompnents/InputField";
// import { useIntl } from "react-intl";

// const validationSchema = Yup.object({
//   branches: Yup.array().of(
//     Yup.object({
//       name: Yup.string().required("Branch name is required"),
//       address: Yup.string().required("Branch address is required"),
//       contactNo: Yup.string().required("Branch contact no is required"),
//       manager: Yup.string().required("Branch manager is required"),
//     })
//   ),
// });

// interface branchFormValues {
//   branches: {
//     name: string;
//     address: string;
//     contactNo: string;
//     manager: string;
//   }[];
// }

// interface branchFormProps {
//   initialValues: branchFormValues;
//   onSubmit: (values: branchFormValues) => Promise<void>;
// }

// const BranchEditForm = ({ initialValues, onSubmit }: branchFormProps) => {
//   const { locale } = useIntl();
//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values) => {
//         onSubmit(values);
//       }}
//       enableReinitialize={true}
//     >
//       {({
//         values,
//         handleSubmit,
//         setFieldTouched,
//         setFieldError,
//         setFieldValue,
//         touched,
//         errors,
//         isSubmitting,
//       }: FormikProps<branchFormValues>) => (
//         <Form>
//           <FieldArray name="branches">
//             {({ push, remove }) => (
//               <div>
//                 {values.branches.map((_, index) => (
//                   <Box
//                     border={"1px solid #e0e0e0"}
//                     dir={locale === "ar" ? "rtl" : "ltr"}
//                     borderRadius={1.3}
//                     padding={2}
//                   >
//                     <Grid container spacing={10}>
//                       <Grid item md={12}>
//                         <InputField
//                           label={`Branch ${index + 1}`}
//                           name={`branches.${index}.name`}
//                           value={values.branches[index].name}
//                           onChange={(value) =>
//                             setFieldValue(`branches.${index}.name`, value)
//                           }
//                           onBlur={() =>
//                             setFieldTouched(`branches.${index}.name`, true)
//                           }
//                           error={
//                             touched.branches?.[index]?.name &&
//                             typeof errors.branches?.[index] === "object" &&
//                             Boolean(errors.branches?.[index]?.name)
//                           }
//                           helperText={
//                             touched.branches?.[index]?.name &&
//                             typeof errors.branches?.[index] === "object"
//                               ? errors.branches?.[index]?.name
//                               : ""
//                           }
//                         />
//                       </Grid>
//                       <Grid item md={12}>
//                         <InputField
//                           label={`Branch ${index + 1}`}
//                           name={`branches.${index}.address`}
//                           value={values.branches[index].address}
//                           onChange={(value) =>
//                             setFieldValue(`branches.${index}.address`, value)
//                           }
//                           onBlur={() =>
//                             setFieldTouched(`branches.${index}.address`, true)
//                           }
//                           error={
//                             touched.branches?.[index]?.address &&
//                             typeof errors.branches?.[index] === "object" &&
//                             Boolean(errors.branches?.[index]?.address)
//                           }
//                           helperText={
//                             touched.branches?.[index]?.address &&
//                             typeof errors.branches?.[index] === "object"
//                               ? errors.branches?.[index]?.address
//                               : ""
//                           }
//                         />
//                       </Grid>
//                       <Grid item md={6}>
//                         <InputField
//                           label={`Branch ${index + 1}`}
//                           name={`branches.${index}.contactNo`}
//                           value={values.branches[index].contactNo}
//                           onChange={(value) =>
//                             setFieldValue(`branches.${index}.contactNo`, value)
//                           }
//                           onBlur={() =>
//                             setFieldTouched(`branches.${index}.contactNo`, true)
//                           }
//                           error={
//                             touched.branches?.[index]?.contactNo &&
//                             typeof errors.branches?.[index] === "object" &&
//                             Boolean(errors.branches?.[index]?.contactNo)
//                           }
//                           helperText={
//                             touched.branches?.[index]?.contactNo &&
//                             typeof errors.branches?.[index] === "object"
//                               ? errors.branches?.[index]?.contactNo
//                               : ""
//                           }
//                         />
//                       </Grid>
//                       <Grid item md={6}>
//                         <InputField
//                           label={`Branch ${index + 1}`}
//                           name={`branches.${index}.manager`}
//                           value={values.branches[index]?.manager}
//                           onChange={(value) =>
//                             setFieldValue(`branches.${index}.manager`, value)
//                           }
//                           onBlur={() =>
//                             setFieldTouched(`branches.${index}.manager`, true)
//                           }
//                           error={
//                             touched.branches?.[index]?.manager &&
//                             typeof errors.branches?.[index] === "object" &&
//                             Boolean(errors.branches?.[index]?.manager)
//                           }
//                           helperText={
//                             touched.branches?.[index]?.manager &&
//                             typeof errors.branches?.[index] === "object"
//                               ? errors.branches?.[index]?.manager
//                               : ""
//                           }
//                         />
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 ))}
//                 <Button type="button" onClick={() => push({ name: "" })}>
//                   Add Branch
//                 </Button>
//               </div>
//             )}
//           </FieldArray>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={isSubmitting}
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           >
//             {isSubmitting ? "Submitting..." : "Update Basic Information"}
//           </Button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default BranchEditForm;

import React from "react";

function BranchEditForm() {
  return <div>BranchEditForm</div>;
}

export default BranchEditForm;
