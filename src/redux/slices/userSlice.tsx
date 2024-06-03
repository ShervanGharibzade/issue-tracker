import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";

interface Workspace {
  id: string;
  title: string;
  isFovrite: boolean;
}

interface user {
  name: string;
  lastName: string;
}

interface task {
  workSpaceId: string;
  description: string;
  columnId: string;
  id: string;
  status: string; //TODO change status to state
  assignment: string[];
}

interface taskPayload {
  workSpaceId: string;
  columnId: string;
  description: string;
  status: string;
  assignment: string;
}

interface columnPayload {
  workSpaceId: string;
  title: string;
  id?: any;
}

interface column {
  workSpaceId: string;
  title: string;
  id: any;
}

interface workSpacePayload {
  title: string;
  id: any;
}

interface editTask {
  description: string;
  id: any;
  assignment: string[];
}

interface userState {
  workSpaceId: string;
  workSpaces: Workspace[];
  auth: boolean;
  user: user;
  statusList: any;
  columns: column[];
  tasks: task[];
}

const initialState: userState = {
  workSpaceId: "1c1h2",
  workSpaces: [
    { id: "1c1h2", title: "chat-app", isFovrite: false },
    { id: "1c1h3", title: "todolist", isFovrite: false },
    { id: "1c1h4", title: "new product", isFovrite: false },
  ],
  auth: true,
  user: {
    name: "test",
    lastName: "user",
  },
  statusList: ["backLog", "pending", "finish", "issuse"],
  columns: [
    {
      workSpaceId: "1c1h2",
      title: "backLog",
      id: "11",
    },
    {
      workSpaceId: "1c1h2",
      title: "pending",
      id: "12",
    },
    {
      workSpaceId: "1c1h3",
      title: "backLog",
      id: "111",
    },
    {
      workSpaceId: "1c1h4",
      title: "backLog",
      id: "1111",
    },
    {
      workSpaceId: "1c1h3",
      title: "pending",
      id: "122",
    },
    {
      workSpaceId: "1c1h3",
      title: "finish",
      id: "123",
    },
  ],
  tasks: [
    {
      workSpaceId: "1c1h4",
      description: "create button",
      columnId: "1111",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h4",
      description: "create button",
      columnId: "1111",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h4",
      description: "create button",
      columnId: "1111",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h3",
      description: "create button",
      columnId: "111",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h3",
      description: "create button",
      columnId: "122",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h3",
      description: "create modal",
      columnId: "111",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h3",
      description: "create button",
      columnId: "122",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h2",
      description: "create button",
      columnId: "11",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["mohamad", "shervan", "ali"],
    },
    {
      workSpaceId: "1c1h2",
      description: "create modal",
      columnId: "11",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["ahmad", "hosein"],
    },
    {
      workSpaceId: "1c1h2",
      description: "fix responsive",
      columnId: "12",
      id: uuidv4(),
      status: "backLog" || "pending" || "finish" || "issuse",
      assignment: ["payam", "shervan"],
    },
  ],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    selectWorkSpace(state, action: PayloadAction<string>) {
      state.workSpaceId = action.payload;
    },
    changeAuth(state, action: PayloadAction<boolean>) {
      state.auth = action.payload;
    },
    addNewWorkSpace(state, action: PayloadAction<string>) {
      const newWorkSpace = {
        id: uuidv4(),
        title: action.payload,
        isFovrite: false,
      };
      state.workSpaces.push(newWorkSpace);
    },
    addWorkspace(state, action: PayloadAction<string>) {
      const newWorkspace: Workspace = {
        id: uuidv4(),
        title: action.payload,
        isFovrite: false,
      };
      state.workSpaces.push(newWorkspace);
    },
    changeWorkSpaceName(state, action: PayloadAction<workSpacePayload>) {
      const { id, title } = action.payload;
      const newWorkSpaces = state.workSpaces.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            title: title,
          };
        } else {
          return { ...i };
        }
      });
      state.workSpaces = newWorkSpaces;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const workspaceId = action.payload;
      const workspaceToUpdate = state.workSpaces.map((i) => {
        if (i.id === workspaceId) {
          return {
            ...i,
            isFovrite: !i.isFovrite,
          };
        } else {
          return { ...i };
        }
      });
      state.workSpaces = workspaceToUpdate;
    },
    deleteWorkSpace(state, action: PayloadAction<string>) {
      const workspaceId = action.payload;
      const workspaceDelete = state.workSpaces.filter(
        (i) => i.id !== workspaceId
      );
      state.workSpaces = workspaceDelete;
    },
    addTask(state, action: PayloadAction<taskPayload>) {
      const newTask: task = {
        workSpaceId: action.payload.workSpaceId,
        description: action.payload.description,
        columnId: action.payload.columnId,
        id: uuidv4(),
        status: action.payload.status,
        assignment: [action.payload.assignment],
      };

      state.tasks.push(newTask);
    },
    changeNameColumn(state, action: PayloadAction<columnPayload>) {
      const { id, title } = action.payload;

      const newColumns = state.columns.map((i) => {
        if (i.id === id) {
          return { ...i, title: title };
        }
        return i;
      });

      state.columns = newColumns;
    },
    addFirstColumn(state, action: PayloadAction<columnPayload>) {
      const { workSpaceId, title } = action.payload;

      const newColumn = {
        workSpaceId: workSpaceId,
        title: title,
        id: uuidv4(),
      };

      state.columns.push(newColumn);
    },
    addColumn(state, action: PayloadAction<columnPayload>) {
      const newColumn = {
        workSpaceId: action.payload.workSpaceId,
        title: action.payload.title,
        id: uuidv4(),
      };
      state.columns.push(newColumn);
    },
    deleteColumn(state, action: PayloadAction<columnPayload>) {
      console.log(action.payload.id, "send");

      const newColumns = state.columns.filter(
        (i) => i.id !== action.payload.id
      );
      const newTasks = state.tasks.filter(
        (i) => i.columnId !== action.payload.id
      );

      state.columns = newColumns;
      state.tasks = newTasks;
    },
    editTask(state, action: PayloadAction<editTask>) {
      const { id, description, assignment } = action.payload;
      const newTasks = state.tasks.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            description: description,
            assignment: assignment,
          };
        } else {
          return i;
        }
      });

      state.tasks = newTasks;
    },
    deleteTask(state, action: PayloadAction<string>) {
      const newTasks = state.tasks.filter((i) => i.id !== action.payload);
      state.tasks = newTasks;
    },
  },
});

export default userSlice.reducer;
export const selectWorkSpaces = (state: RootState) => state.user.workSpaces;
export const getAuth = (state: RootState) => state.user.auth;
export const getColumns = (state: RootState) => state.user.columns;
export const getTasks = (state: RootState) => state.user.tasks;
export const getStatusList = (state: RootState) => state.user.statusList;
export const getWorkSpaceId = (state: RootState) => state.user.workSpaceId;
export const getWorkSpaces = (state: RootState) => state.user.workSpaces;
export const {
  addWorkspace,
  toggleFavorite,
  deleteWorkSpace,
  changeAuth,
  addTask,
  changeNameColumn,
  addColumn,
  deleteColumn,
  changeWorkSpaceName,
  addNewWorkSpace,
  editTask,
  selectWorkSpace,
  addFirstColumn,
  deleteTask,
} = userSlice.actions;
