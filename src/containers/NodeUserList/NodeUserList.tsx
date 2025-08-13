import Close from "@mui/icons-material/Close";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import ArrowBack from "@mui/icons-material/KeyboardArrowLeft";
import ArrowForward from "@mui/icons-material/KeyboardArrowRight";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { Component, RefObject } from "react";
import { FaRegBuilding } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { ResizableBox } from "react-resizable";
import {
  getNodeUserFilterList,
  getNodeUsers,
  getUserFilteredList,
} from "../../apis/flowBuilder";
import {
  createNodeUser,
  listOrganizationStaffs,
  token,
} from "../../apis/organization"; // Import the new function
import notfound from "../../assets/not_found.svg";
import CheckBox from "../../components/FormElements/components/CheckBox";
import TabMenu from "../../components/TabMenu/TabMenu";
import FilterChip from "../../pages/inbox/FilterChip";
import "./NodeUserList.css"; // Import sidebar styles

// Define the props interface
interface Sidebar2Props {
  show: boolean;
  onClose: () => void; // Function to handle closing the sidebar
  selectedNodeId: string; // Node ID to be passed
  nodeName: string; // Node name,
  locale?: string;
}

// Define the state interface
interface Sidebar2State {
  searchTerm: string;
  count: number;
  next: string;
  hasMore: boolean;
  selectedCategory: string; // Current selected label
  hierarchy: Array<{
    hierarchy: string;
    users: Array<{
      name: string;
      uuid: string;
      profile_img: string;
      is_selected: string;
    }>;
  }>; // Hierarchy structure
  scrollPosition: number; // For controlling scroll movement
  selectedItems: string[]; // Array to track selected items
  isLoading: boolean; // Loading state
  filteredUsers: any[];
  containerWidth: number;
  filterList: any[];
  selectedFilter: string; // Currently selected filter
  filterType: string; // Type of filter (e.g., "Department", "Group")
  selectAll?: boolean; // State to track if all items are selected
}

class NodeUserList extends Component<Sidebar2Props, Sidebar2State> {
  categoryContainerRef: RefObject<HTMLDivElement>;
  props: any;

  constructor(props: Sidebar2Props) {
    super(props);
    this.state = {
      hasMore: true,
      searchTerm: "",
      selectedCategory: "All", // Initially set to 'All'
      hierarchy: [], // Initialize hierarchy
      scrollPosition: 0, // For controlling scroll movement
      selectedItems: [], // Initialize selected items
      isLoading: true, // Initially loading
      filteredUsers: [],
      containerWidth: 650,
      count: 0,
      next: "",
      filterList: [],
      selectedFilter: "all",
      filterType: "group",
    };

    // Reference to category container for scrolling
    this.categoryContainerRef = React.createRef();
  }

  componentDidMount() {
    this.fetchHierarchy(); // Fetch hierarchy on component mount
    this.getFilters();
  }

  componentDidUpdate(prevProps: Sidebar2Props, prevState: Sidebar2State) {
    if (prevProps.selectedNodeId !== this.props.selectedNodeId) {
      // Refetch hierarchy data if a new node is selected
      this.fetchHierarchy();
    }

    if (prevState.selectedCategory !== this.state.selectedCategory) {
      this.getUserList();
    }
    if (prevState.filterType !== this.state.filterType) {
      this.getFilters();
    }
    if (prevState.selectedFilter !== this.state.selectedFilter) {
      this.getfileredUserList();
    }
  }

  async getFilters() {
    try {
      if (this.state.filterType === "department") {
        const data = await getNodeUserFilterList("Department");
        this.setState({
          filterList: data.results.map((dat: any) => ({
            id: dat.uuid,
            ...dat,
          })),
        });
      } else if (this.state.filterType === "group") {
        const data1 = await getNodeUserFilterList("Group");
        this.setState({ filterList: data1 });
      } else {
        this.setState({ filterList: [] });
      }
    } catch (error) {
      console.log("list users", error);
    }
  }

  async getUserList() {
    try {
      await getNodeUsers("Group", this.state.selectedCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async getfileredUserList() {
    this.setState({ isLoading: true });
    try {
      const data = await getUserFilteredList(
        this.props.selectedNodeId,
        this.state.filterType,
        this.state.selectedFilter
      );

      this.setState({
        filteredUsers: data.results,
        next: data.next,
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  fetchHierarchy = async () => {
    this.setState({ isLoading: true }); // Start loading

    try {
      const data = await listOrganizationStaffs(this.props.selectedNodeId); // Fetch hierarchy from your API

      // Get users that are already selected
      const preSelectedUsers = data.results
        .filter((user: { is_selected: boolean }) => user.is_selected) // Check if user is selected
        .map((user: { uuid: string }) => user.uuid); // Get the names of the pre-selected users

      // Set the hierarchy and the selectedItems
      this.setState({
        count: data.count,
        next: data.next,
        hierarchy: data.results,
        selectedItems: preSelectedUsers, // Initialize selectedItems with pre-selected users
        isLoading: false, // Stop loading
        filteredUsers: data.results,
      });
    } catch (error) {
      console.error("Error fetching hierarchy:", error);
    } finally {
      this.setState({ isLoading: false }); // Ensure loading state is false on error
    }
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    this.setState({
      searchTerm: event.target.value,
      filteredUsers: this.state.hierarchy.filter(
        (state: any) =>
          this.getTranslationData(state, "name")
            ?.toLowerCase()
            .includes(searchTerm) ||
          this.getTranslationData(state, "department")
            ?.toLowerCase()
            .includes(searchTerm) ||
          state?.email.toLowerCase().includes(searchTerm)
      ),
    });
  };

  handleCategoryChange = (category: any) => {
    this.setState({ selectedFilter: category });
    this.setState({ filteredUsers: [] });
  };

  handleScrollLeft = () => {
    const container = this.categoryContainerRef.current;
    if (container) {
      const newScrollPosition = Math.max(this.state.scrollPosition - 100, 0); // Scroll left
      container.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      this.setState({ scrollPosition: newScrollPosition });
    }
  };

  handleScrollRight = () => {
    const container = this.categoryContainerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const newScrollPosition = Math.min(
        this.state.scrollPosition + 100,
        maxScrollLeft
      );

      container.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      this.setState({ scrollPosition: newScrollPosition });
    }
  };

  handleItemClick = async (itemName: string) => {
    let selectedIds: any[] = [];
    this.setState((prevState) => {
      const isSelected = prevState.selectedItems.includes(itemName);
      selectedIds = isSelected
        ? prevState.selectedItems.filter((name) => name !== itemName) // Deselect item
        : [...prevState.selectedItems, itemName]; // Select item
      updateIds(selectedIds); // Call the updateIds function
      return {
        selectedItems: selectedIds,
      };
    });

    // Find the user that was clicked
    // const clickedUser = this.state.hierarchy
    //   .flatMap((department) => department.users)
    //   .find((user) => user.name === itemName);

    const updateIds = async (selectedIds: any) => {
      const clickedUser: any = this.state.hierarchy.some(
        (user: any) => user.uuid === itemName
      );

      // If user is found, call the createNodeUser API
      if (clickedUser) {
        try {
          await createNodeUser(this.props.selectedNodeId, selectedIds);
        } catch (error) {
          console.error("Error calling createNodeUser API:", error);
        }
      }
    };
  };

  getTranslationData(data: any, key: string) {
    const locale = this.props.locale || "en"; // Provide a default value for locale
    return data.translations?.[locale]?.[key];
  }
  handleResize = (e: any, data: any) => {
    this.setState({ containerWidth: data.size.width });
  };

  fetchMoreData = () => {
    this.setState({ isLoading: true });
    fetch(this.state.next, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState((prev) => ({
          hasMore: data.next !== null,
          next: data.next,
          hierarchy: [...prev.hierarchy, ...data.results],
          filteredUsers: [...prev.filteredUsers, ...data.results],
        }));
        this.setState({ isLoading: false });
      });
  };
  getColumnsBasedOnWidth(containerWidth?: number) {
    if ((containerWidth ? containerWidth : this?.state?.containerWidth) > 800) {
      return 3;
    } else if (
      (containerWidth ? containerWidth : this?.state?.containerWidth) > 600
    ) {
      return 4;
    } else if (
      (containerWidth ? containerWidth : this?.state?.containerWidth) <= 400
    ) {
      return 12;
    } else {
      return 6;
    }
  }
  handleSelectedFilter = (value: string) => {
    this.setState({ filterType: value, selectedFilter: "" });
  };

  render() {
    const { show, onClose } = this.props;
    const { searchTerm, selectedItems, selectedFilter } = this.state;

    return (
      // <ClickAwayListener onClickAway={() => onClose()}>
      <ResizableBox
        className="z-[1000]"
        width={500}
        height={0}
        axis="x"
        resizeHandles={["w"]}
        // onResizeStop={handleResize}
        minConstraints={[500, 0]}
        maxConstraints={[1200, 0]}
        handle={
          <div
            style={{
              width: "2px",
              cursor: "ew-resize",
              // backgroundColor: "#007bff",
              height: "calc(100vh - 113px)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        }
      >
        <div
          className={`sidebar2 ${
            show ? "visible" : ""
          } bg-white p-4 border border-gray-300 h-[calc(100vh_-_113px)] overflow-y-auto`}
          style={{ width: "100%" }}
          id="scrollableDiv"
        >
          <div>
            <InfiniteScroll
              dataLength={this.state.filteredUsers.length} //This is important field to render the next data
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={<></>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              scrollableTarget="scrollableDiv"
            >
              <div className="header flex flex-row justify-between">
                <span style={{ fontSize: "18px" }}>
                  {/* <FormattedMessage id="addUsertoWorkFlow"></FormattedMessage> */}
                  {this.props?.nodeName}
                </span>

                <IconButton size="small" onClick={onClose}>
                  <Close />
                </IconButton>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search...."
                  value={searchTerm}
                  onChange={this.handleSearchChange}
                />
              </div>

              <TabMenu
                onChange={this.handleSelectedFilter}
                selected={this.state.filterType}
                tabMenus={[
                  {
                    label: "group",
                    value: "group",
                  },
                  {
                    label: "department",
                    value: "department",
                  },
                ]}
              />
              {/* Category navigation with arrows */}
              <div className="flex flex-row justify-between align-items-center mt-2">
                <IconButton size="small" onClick={this.handleScrollLeft}>
                  <ArrowBack />
                </IconButton>
                <Stack
                  direction="row"
                  spacing={1}
                  className="category-container"
                  ref={this.categoryContainerRef}
                >
                  <FilterChip
                    name={"All"}
                    selected={!selectedFilter}
                    color={!selectedFilter ? "#1976d2" : "#374151"}
                    chipData={undefined}
                    onClick={() => {
                      this.handleCategoryChange(undefined);
                    }}
                  />
                  {this.state.filterList?.map((label) => (
                    <FilterChip
                      key={label.uuid}
                      name={` (${label.count || 0}) ` + label.name}
                      selected={selectedFilter === label.id}
                      color={
                        selectedFilter === label.id ? "#1976d2" : "#374151"
                      }
                      chipData={undefined}
                      onClick={() => {
                        this.handleCategoryChange(label.id);
                      }}
                    />
                  ))}
                </Stack>
                <IconButton
                  size="small"
                  // className="arrow arrow-right"
                  onClick={this.handleScrollRight}
                >
                  <ArrowForward />
                </IconButton>
              </div>

              <Stack direction="row" marginTop={1}>
                <CheckBox
                  label={"Select All (0)"}
                  isChecked={this.state.selectAll}
                  onChange={(e: any): void => {
                    this.setState({
                      selectAll: e.target.checked,
                    });
                  }}
                />
              </Stack>
              {this.state.filteredUsers.length === 0 &&
                !this.state.isLoading && (
                  <Stack
                    className="no-data"
                    height="300px"
                    width="100%"
                    alignItems="center"
                    spacing={2}
                  >
                    <img
                      src={notfound}
                      height="200px"
                      width="200px"
                      alt="No data"
                      style={{ objectFit: "contain" }}
                    />
                    <Typography>
                      No {this.state.filterType} Available
                    </Typography>
                  </Stack>
                )}
              {/* Users display */}
              {/* <div className="items-grid"> */}

              <Grid container rowSpacing={1.5} columnSpacing={1.5}>
                {this.state.filteredUsers.map((user: any) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={this.getColumnsBasedOnWidth()}
                    key={user.uuid}
                    padding={1.5}
                  >
                    <ButtonBase
                      sx={{
                        padding: 1.5,
                        width: "100%",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#fff",
                      }}
                      className={`item ${
                        selectedItems.includes(user.uuid) ? "selected" : ""
                      }`}
                      onClick={() => this.handleItemClick(user.uuid)}
                    >
                      <Stack alignItems="center" spacing={1} width="100%">
                        <Avatar
                          src={user.profile_img || ""}
                          sx={{
                            width: "70px",
                            height: "70px",
                            bgcolor: getProfileColor(user.email),
                            fontSize: "34px",
                          }}
                        >
                          {this.getTranslationData(user, "name")?.charAt(0)}
                        </Avatar>
                        <Stack
                          direction="row"
                          spacing={0.25}
                          alignItems="center"
                        >
                          <Typography variant="h6">
                            {this.getTranslationData(user, "name")}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            variant="subtitle1"
                            textAlign="center"
                          >
                            (Junior)
                          </Typography>{" "}
                        </Stack>
                        <Divider flexItem />
                      </Stack>
                      <Stack spacing={1} width="100%" marginTop={2}>
                        <CardDetail
                          title="Email"
                          icon={<EmailOutlined />}
                          value={user.email}
                        />
                        <CardDetail
                          title="Department"
                          icon={<FaRegBuilding />}
                          value={this.getTranslationData(user, "department")}
                        />
                      </Stack>
                    </ButtonBase>
                  </Grid>
                ))}

                {this.state.isLoading && (
                  <CardLoading
                    getColumnsBasedOnWidth={this.getColumnsBasedOnWidth()}
                  />
                )}
              </Grid>
            </InfiniteScroll>
          </div>
        </div>
        {/* </div> */}
      </ResizableBox>
      // </ClickAwayListener>
    );
  }
}

export default NodeUserList;

function CardDetail({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" width="100%">
      <Box
        sx={{
          "& svg": {
            height: "16px",
            width: "16px",
            color: "grey",
          },
        }}
      >
        {icon}
      </Box>
      <Stack width="80%" alignItems={"flex-start"} flex={1}>
        <Typography color="text.secondary" variant="subtitle2">
          {title}
        </Typography>

        <Typography
          variant="subtitle1"
          noWrap
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

function CardLoading({
  getColumnsBasedOnWidth,
}: {
  getColumnsBasedOnWidth: number;
}) {
  return (
    <>
      {new Array(10).fill(0).map((_, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          md={getColumnsBasedOnWidth}
          padding={1.5}
        >
          <ButtonBase
            sx={{
              padding: 1.5,
              width: "100%",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              backgroundColor: "#fff",
            }}
            className={"item"}
          >
            <Stack alignItems="center" spacing={1} width="100%">
              <Skeleton variant="circular" width={70} height={70} />
              <Stack
                direction="row"
                justifyContent="center"
                spacing={1}
                width="100%"
              >
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
              </Stack>
              <Divider flexItem />
            </Stack>
            <Stack spacing={0.25} width="100%" marginTop={2}>
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" />
            </Stack>
            <Stack spacing={0.25} width="100%" marginTop={2}>
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" />
            </Stack>
          </ButtonBase>
        </Grid>
      ))}
    </>
  );
}

function getProfileColor(input: string) {
  // Expanded list of 20 Google-like colors
  const colors = [
    "#4285F4",
    "#DB4437",
    "#0F9D58",
    "#F4B400",
    "#A142F4", // Primary Google colors
    "#FF6D00",
    "#46BDC6",
    "#2E7D32",
    "#C2185B",
    "#7B1FA2",
    "#E53935",
    "#8E24AA",
    "#3949AB",
    "#1E88E5",
    "#00ACC1",
    "#00897B",
    "#43A047",
    "#FDD835",
    "#FB8C00",
    "#F4511E",
    "#D81B60",
    "#5E35B1",
    "#039BE5",
    "#00ACC1",
    "#00838F",
    "#2E7D32",
    "#C0CA33",
    "#FFD600",
    "#FF7043",
    "#6D4C41",
  ];

  // Simple hash function
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash); // Ensure positive hash
  }

  // Get hash and map to color
  const hashValue = hashString(input);
  return colors[hashValue % colors.length];
}
