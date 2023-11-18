import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  type SettingsProps = {
    bombs: number;
    setBombs: any;
  };
  const Settings: React.FC<SettingsProps> = ({ bombs, setBombs }) => {
    return (
      <>
        <VStack justifyContent="flex-start" alignItems="flex-start">
          <Text>Bomb Count: {bombs}</Text>
  
          <Slider
            width="10em"
            onChange={(e) => setBombs(e)}
            min={1}
            max={80}
            aria-label="slider-ex-1"
            defaultValue={40}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </VStack>
      </>
    );
  };
  export default Settings;
  