import React, { useState } from "react";
import { generateQuoteAction } from "../redux/action/user";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
const CreateQuote = () => {
  const [quote, setQuote] = useState<string>("");
  const dispatch = useAppDispatch();
  const { user, isUserDataPending } = useAppSelector((state) => state.user);
  const handleCreate = () => {
    dispatch(generateQuoteAction(quote));
  };
  return (
    <div className="h-screen flex flex-col gap-y-2 justify-center items-center">
      <div>
        {isUserDataPending && <h1>loading...</h1>}
        {!isUserDataPending && (
          <h1 className="bg-green-200 border-1 border-white-100 border-lg">
            total created quotes are: {user?.quote?.length}
          </h1>
        )}
        <input
          type="text"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="enter quote"
          className="p-2 rounded-lg border-solid border-2 border-gray-300"
        />
      </div>
      <button className="p-2.5 bg-purple-200 rounded-lg" onClick={handleCreate}>
        Create Quote
      </button>
    </div>
  );
};

export default CreateQuote;
