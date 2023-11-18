import { Flex, Text, VStack, HStack, Link } from "@chakra-ui/react";
import React from "react";
import styles from "../src/app/page.module.css";
const HowTo = () => {
  return (
    <div className={styles.sweepUI}>
      <Flex
        flexDirection="column"
        justifyContent="flex-start"
        padding="1em"
        bgColor="white"
      >
        <h1>How to play</h1>
       <p>Right click to flag bombs, toggle button on mobile.</p>
       <p>Left click to clear tile.</p>
       <p>Double click for Chording. See <Link color='blue.400' href="http://www.minesweeper.info/wiki/Chord">Here</Link></p>

      </Flex>
    </div>
  );
};

export default HowTo;
