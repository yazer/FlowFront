import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { FormattedMessage, useIntl } from "react-intl";
import { DeleteMethod, fetchUserGroups } from "../../../apis/administration";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import NoResults from "../../../components/NoResults";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import CreateButton from "../../../components/Permissions/CreateButton";
import CreateOrEdit from "./createOrEditGroup";
import { MdDelete, MdEdit } from "react-icons/md";
import { CREATE_GROUP } from "../../../apis/urls";
import toast from "react-hot-toast";
import { WarningAmber } from "@mui/icons-material";
import useTranslation from "../../../hooks/useTranslation";

type TranslationMap = {
  [languageCode: string]: {
    name: string;
  };
};

type Group = {
  id: number;
  name: string;
  translations: TranslationMap;
  count: number;
};

const UserGroupAdministration = () => {
  const navigate = useNavigate();
  const { locale } = useIntl();

  const [dataList, setDataList] = useState<Group[]>([]);
  const [loader, setLoader] = useState(true);

  const { translate } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await fetchUserGroups();
      setDataList(res ?? []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const handleView = async (id: any) => {
    navigate("/administration/user-groups/users/" + id);
    // setSelectedGroup(id);
    // try {
    //   const res = await fetchUserGroupByID(id)
    //   setSelectedGroup(res)
    // } catch (error: any) {
    //   toast.error(error?.message ?? "")
    //   console.log(error)
    // }
  };

  const [editClose, setEditClose] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Group | null>(null);

  const handleEditClose = () => {
    setEditClose(false);
    setSelectedRow(null);
  };
  const handleOpen = () => {
    setEditClose(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await DeleteMethod(CREATE_GROUP, String(confirmDelete) ?? "");
      toast.success("Successfully deleted Branch");
    } catch (error) {
      toast.error("Error while deleting Branch");
    } finally {
      fetchList();
      setConfirmDelete(null);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            <FormattedMessage id="headingUserGroupManagement"></FormattedMessage>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            <FormattedMessage id="subHeadingUserGroupManagement"></FormattedMessage>
          </p>
        </div>
        <CreateOrEdit
          onSucess={() => {
            handleEditClose();
            fetchList();
          }}
          open={editClose}
          handleClose={handleEditClose}
          handleOpen={handleOpen}
          initialData={selectedRow}
        />
      </div>

      <Grid container spacing={2}>
        {!loader && (!Array.isArray(dataList) || dataList.length === 0) && (
          <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
            <NoResults></NoResults>
          </div>
        )}
        {loader ? (
          <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
            <CircularProgress />
          </div>
        ) : (
          dataList &&
          Array.isArray(dataList) &&
          dataList?.map((item) => (
            <Grid item md={3} lg={3} xs={12}>
              <div className="w-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="p-4 space-y-4">
                  {/* Header: Name + Action buttons */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item?.translations?.[locale]?.name}
                    </h3>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleOpen();
                          setSelectedRow(item);
                        }}
                      >
                        <MdEdit className="text-gray-600 hover:text-blue-600" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setConfirmDelete(item?.id)}
                      >
                        <MdDelete className="text-gray-600 hover:text-red-500" />
                      </IconButton>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/administration/user-groups/permissions/${item.id}`}
                    >
                      <Button fullWidth variant="outlined" className="text-sm">
                        <FormattedMessage id="viewPermissions" />
                      </Button>
                    </Link>
                    <Link to={`/administration/user-groups/users/${item.id}`}>
                      <Button fullWidth variant="outlined" className="text-sm">
                        <FormattedMessage id="viewUsers" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Grid>
          ))
        )}
      </Grid>

      <DialogCustomized
        open={!!confirmDelete}
        handleClose={() => setConfirmDelete(null)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              color="error"
              onClick={() => {
                setConfirmDelete(null);
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              color="error"
              variant="contained"
              disableElevation
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {translate("delete")}
            </Button>
          </Stack>
        }
        content={
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            gap={1.5}
            p={2}
            borderRadius={2}
          >
            <WarningAmber color="error" sx={{ fontSize: "5rem" }} />
            <Typography variant="body1" textAlign={"center"}>
              <FormattedMessage id="areyouSureDelete"></FormattedMessage>
            </Typography>
          </Box>
        }
        title={<FormattedMessage id="DeleteCategoryTitle"></FormattedMessage>}
      />
    </div>
  );
};

export default UserGroupAdministration;
