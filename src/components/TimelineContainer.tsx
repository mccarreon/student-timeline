import styled from "styled-components";

const Container = styled.div`
  background: lightgrey;
  width: 800px;
  height: 400px;
  position: relative;
  overflow: hidden;
`

const TimelineContainer = () => {
  return (
    <Container>
      <svg
        viewBox="0 0 800 400"
      >
        <line 
          x1="100"
          y1="200"
          x2="700"
          y2="200"
          stroke="#a6d2ff"
          strokeDasharray="18"
          strokeWidth="10"
        />
        <circle 
          cx="100"
          cy="200"
          r="25"
          fill="#0875e1"
        />

        <circle 
          cx="700"
          cy="200"
          r="25"
          fill="#0875e1"
        />

      </svg>
    </Container>
  )
}

export default TimelineContainer;