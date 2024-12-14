import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
interface InfiniteScollViewProps {}
const limit = 10;
const InfiniteScrollView = ({}: InfiniteScollViewProps) => {
  const { ref, inView } = useInView();
  const [offset, setOffset] = useState(limit);

  return <div>InfiniteScrollView</div>;
};

export default InfiniteScrollView;
