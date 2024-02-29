import React from "react";
import styled, { keyframes } from "styled-components";

// Create a keyframe animation for the spinner rotation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled component for the loading spinner
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #9c9e9e;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${rotate} 1s linear infinite;
`;

// LoadingSpinner component
const LoadingSpinner = ({ loading }: { loading: boolean }) => {
  return loading ? <Spinner /> : null;
};

export default LoadingSpinner;
