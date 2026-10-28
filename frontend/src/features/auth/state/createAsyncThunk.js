import { createAsyncThunk } from "@reduxjs/toolkit";

const createAppAsyncThunk = (typePrefix, service) => {
  return createAsyncThunk(typePrefix, async (authData, thunkAPI) => {
    try {
      return await service(authData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "something went wrong",
      );
    }
  });
};


export default createAppAsyncThunk;