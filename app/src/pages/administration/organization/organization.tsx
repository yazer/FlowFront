import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { RiBuildingLine } from "react-icons/ri";
import { BiGitBranch } from "react-icons/bi";
import { IoIosPricetag } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { FormattedMessage, useIntl } from "react-intl";
import Chip from "../../../components/Chip/Chip";
import { useEffect, useState } from "react";
import { fetchOrganizationDetails } from "../../../apis/administration";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import BasicInformationForm from "./BasicEditForm";
import { useNavigate } from "react-router";
import { updateOraganization } from "../../../apis/organization";
import { useOrganization } from "../../../context/OrganizationContext";
import { ScreenKeyEnum } from "../../../utils/permissions";

const plans = [
  {
    id: 1,
    title: "Business Plan",
    price: 6999,
    per: "/Month",
    discount: "-20%",
    isCurrentPlan: false,
    features: ["Upto 50 Users", "20 Process", "2 GB Data Storage"],
  },
  {
    id: 2,
    title: "Business Plan",
    price: 6999,
    per: "/Month",
    discount: "-20%",
    isCurrentPlan: true, // Current Plan
    endDate: "Dec 12 2025",
    features: ["Upto 50 Users", "20 Process", "2 GB Data Storage"],
  },
  {
    id: 3,
    title: "Business Plan",
    price: 6999,
    per: "/Month",
    discount: "-20%",
    isCurrentPlan: false,
    features: ["Upto 50 Users", "20 Process", "2 GB Data Storage"],
  },
];

function OrganizationAdministration() {
  const navigate = useNavigate();
  const { locale } = useIntl();
  const { refreshOrganizationData, usePermissions } = useOrganization();

  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminOrganization
  );

  const [organizationData, setOrganizationData] = useState<any>(null);
  const [editDialog, setEditDialog] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await fetchOrganizationDetails();
      setOrganizationData(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 flex items-center w-full justify-center">
      <div className="flex flex-col gap-4 w-full">
        <Box
          border={"1px solid #e0e0e0"}
          dir={locale === "ar" ? "rtl" : "ltr"}
          borderRadius={1.3}
        >
          <Stack direction="row" justifyContent="space-between" padding={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <RiBuildingLine />
              <Typography variant="h5">
                <FormattedMessage id="basicInformation"></FormattedMessage>
              </Typography>
            </Stack>
            {canEdit && (
              <Button
                size="small"
                sx={{ height: 20 }}
                onClick={() => {
                  setEditDialog(true);
                }}
              >
                <FormattedMessage id="editDependentDetails"></FormattedMessage>
              </Button>
            )}
          </Stack>
          <Divider />

          <Stack direction="column" flexWrap="wrap" gap={1.5}>
            <div className="flex items-center justify-center w-full">
              <Box
                position="relative"
                width="100%"
                height={200}
                display="flex"
                alignItems="center"
                justifyContent="center"
                // bgcolor={"white"}
              >
                {organizationData?.cover_image && (
                  <Box
                    component="img"
                    src={organizationData?.cover_image}
                    alt="cover"
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Overlay for optional darkening effect */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                />

                {/* Avatar */}
                <Avatar
                  src={organizationData?.logo}
                  sx={{
                    width: 120,
                    height: 120,
                    zIndex: 2,
                    bgcolor: "primary.main",
                    fontSize: "25px",
                    boxShadow:
                      "0px 2px 3px 0px #0000004D, 0px 6px 10px 4px #00000026",
                  }}
                >
                  {"Anandh".charAt(0)}
                </Avatar>
              </Box>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <Typography variant="h5">
                {organizationData?.translations?.[locale]}
              </Typography>

              <Grid container rowSpacing={2}>
                <Grid item md={8}>
                  <Stack minWidth={100}>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      <FormattedMessage id="address"></FormattedMessage>
                      {":"}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {organizationData?.address
                        ? organizationData?.address?.[locale]
                        : "--"}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack minWidth={100}>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      <FormattedMessage id="branchMail"></FormattedMessage>
                      {":"}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {organizationData?.email}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack minWidth={100}>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      <FormattedMessage id="organizationType"></FormattedMessage>
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {organizationData?.organization_type
                        ? organizationData?.organization_type?.[locale]
                        : "--"}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack minWidth={100}>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      <FormattedMessage id="industry"></FormattedMessage>
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {organizationData?.industry
                        ? organizationData?.industry?.[locale]
                        : "--"}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack minWidth={100}>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      <FormattedMessage id="description"></FormattedMessage>
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {organizationData?.description
                        ? organizationData?.description?.[locale]
                        : "--"}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Box>

        <Box
          border={"1px solid #e0e0e0"}
          dir={locale === "ar" ? "rtl" : "ltr"}
          borderRadius={1.3}
        >
          <Stack direction="row" justifyContent="space-between" padding={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BiGitBranch />
              <Typography variant="h5">
                <FormattedMessage id="branches"></FormattedMessage>
              </Typography>
            </Stack>
            <Button
              size="small"
              sx={{ height: 20 }}
              onClick={() => {
                navigate("/administration/organization-branch");
              }}
            >
              <FormattedMessage id="view"></FormattedMessage>
            </Button>
          </Stack>
          <Divider />

          <Stack direction="column" gap={1.5} padding={2}>
            {organizationData?.branches?.map((item: any) => (
              <Box
                border={"1px solid #e0e0e0"}
                dir={locale === "ar" ? "rtl" : "ltr"}
                borderRadius={1.3}
                padding={2}
              >
                <Grid container>
                  <Grid item md={3}>
                    <Stack minWidth={100}>
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        <FormattedMessage id="branchName"></FormattedMessage>
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {item?.name}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item md={3}>
                    <Stack minWidth={100}>
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        <FormattedMessage id="branchAddress"></FormattedMessage>
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {item?.addresses[0]
                          ? item?.addresses?.[0]?.address +
                            "," +
                            item?.addresses?.[0]?.city
                          : "--"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item md={3}>
                    <Stack minWidth={100}>
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        <FormattedMessage id="branchContact"></FormattedMessage>
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {item.contact_no}
                      </Typography>
                    </Stack>
                  </Grid>
                  {/* <Grid item md={3}>
                    <Stack minWidth={100}>
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        <FormattedMessage id="branchManager"></FormattedMessage>
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {item.branchManager}
                      </Typography>
                    </Stack>
                  </Grid> */}
                  <Grid item md={3}>
                    <Stack minWidth={100}>
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color="text.secondary"
                      >
                        <FormattedMessage id="branchMail"></FormattedMessage>
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {item.email}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        </Box>

        <div>
          <Stack direction="row" spacing={0.5} alignItems="center" mb={2}>
            <IoIosPricetag />
            <Typography variant="h5">
              <FormattedMessage id="pricing"></FormattedMessage>
            </Typography>
          </Stack>

          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"30px"}
          >
            {plans.map((plan, index) => (
              <Box
                key={index}
                width={"25%"}
                border={
                  plan.isCurrentPlan ? "1px solid #2368C4" : "1px solid #e0e0e0"
                }
                dir={locale === "ar" ? "rtl" : "ltr"}
                borderRadius={"10px"}
                padding={"20px"}
                height={plan.isCurrentPlan ? "450px" : "400px"}
                className={plan.isCurrentPlan ? "shadow-lg" : ""}
              >
                <Stack gap={2} mb={3}>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color="primary.main"
                    fontSize="14px"
                  >
                    {plan.title}
                    {plan.isCurrentPlan && (
                      <>
                        &nbsp;{" "}
                        <Chip
                          type={"info"}
                          value={
                            <FormattedMessage id="currentPlan"></FormattedMessage>
                          }
                        />
                      </>
                    )}
                  </Typography>

                  <div className="flex items-center gap-1">
                    <Typography variant="h6" fontSize="20px">
                      &#8377; {plan.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plan.per}
                    </Typography>
                    <Chip type={"info"} value={plan.discount} />
                  </div>

                  {plan.isCurrentPlan ? (
                    <div className="flex items-center justify-between">
                      <Stack minWidth={100}>
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color="text.secondary"
                        >
                          <FormattedMessage id="endOn"></FormattedMessage>
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {plan.endDate}
                        </Typography>
                      </Stack>
                      <button className="w-fit flex items-center gap-2 px-4 py-2 text-white rounded-xl bg-primary">
                        <FormattedMessage id="renew" />
                      </button>
                    </div>
                  ) : (
                    <button className="w-fit flex items-center gap-2 px-4 py-2 text-white rounded-xl bg-primary">
                      <FormattedMessage id="getItNow" />
                    </button>
                  )}
                </Stack>

                <Divider />

                <Stack gap={4} mt={3}>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color="text.secondary"
                    fontSize="14px"
                  >
                    <FormattedMessage id="planDescription"></FormattedMessage>{" "}
                  </Typography>

                  <div className="flex flex-col gap-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <TiTick
                          style={{ color: "#2E7D32", fontSize: "20px" }}
                        />
                        <Typography
                          variant="h5"
                          fontWeight="600"
                          fontSize="14px"
                        >
                          {feature}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </Stack>
              </Box>
            ))}
          </Stack>
        </div>
      </div>

      <DialogCustomized
        open={!!editDialog}
        handleClose={() => setEditDialog(false)}
        // actions={
        //   <Stack direction="row" spacing={2}>
        //     <Button onClick={() => setEditDialog(null)}>
        //       {translate("cancel")}
        //     </Button>
        //     <Button
        //       variant="contained"
        //       disableElevation
        //       // onClick={handleSaveAsTemplate}
        //     >
        //       {translate("update")}
        //     </Button>
        //   </Stack>
        // }
        content={
          <BasicInformationForm
            initialValues={{
              name: organizationData?.translations?.[locale],
              primaryAddress: "123 Main St, City",
              organizationType: "corporation",
              industry: "technology",
              coverPhotoUrl: organizationData?.cover_image,
              logoUrl: organizationData?.logo,
            }}
            onSubmit={async (values, formData) => {
              try {
                await updateOraganization(formData);
                setEditDialog(false);
                getData();
                refreshOrganizationData();
              } catch (error) {
                console.log(error);
              }
            }}
          />
        }
        title={"Update Basic Information"}
      />
    </div>
  );
}

export default OrganizationAdministration;
