"use client";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  Button,
} from "@chakra-ui/react";
import "react";
import { useEffect, useState } from "react";
import { GiLandMine } from "react-icons/gi";
import { BsFillFlagFill } from "react-icons/bs";
import Settings from "./Settings";
import styles from "../../src/app/page.module.css";

const Board: React.FC = () => {
  type Tile = {
    tile: string | number;
    flagged: boolean;
  };
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<any>([]);
  const [gameOver, setGameOver] = useState(true);
  const [turnCount, setTurnCount] = useState(0);
  const [emote, setEmote] = useState("./Chilling.png");
  const [win, setWin] = useState(false);
  const [firstMove, setFirstMove] = useState(true);
  const [bombs, setBombs] = useState(40);
  const [flagCount, setFlagCount] = useState(0);
  const [flagToggle, setFlagToggle] = useState(false);
  //need to expand to all colors
  const color: { [key: string]: string } = {
    "1": "blue",
    "2": "green",
    "3": "red",
    "4": "purple",
    "5": "rgb(43, 167, 224)",
    "6": "rgb(224, 218, 43)",
  };

  //Clears board to pretend a new one has been made
  //The real board is made after the first click to prevent bomb on first move
  const clearBoard = () => {
    setLoading(true);
    let newBoard = [...Array(16)];
    newBoard = newBoard.map((e) =>
      Array(16)
        .fill({})
        .map((u) => ({ tile: "Clear", flagged: false }))
    );
    setBoard(newBoard);
    setGameOver(false);
    setLoading(false);
    setFirstMove(true);
    setFlagCount(0);
  };

  //Board made after first click to prevent first move loss
  const makeBoard = (clickX: number, clickY: number) => {
    setEmote("./Chilling.png");
    //resetting turns and winstate
    setTurnCount(0);
    setWin(false);
    //making clean board
    let newBoard = [...Array(16)];
    newBoard = newBoard.map((e) =>
      Array(16)
        .fill({})
        .map((u) => ({ tile: "Clear", flagged: false }))
    );
    //adding bombs

    for (let i = 0; i < bombs; i++) {
      let x = Math.floor(Math.random() * 16);
      let y = Math.floor(Math.random() * 16);
      //Checking that there is not already a bomb
      //Checks to not place a bomb where the user clicked
      if (newBoard[x][y].tile == "Bomb" || (x == clickX && y == clickY)) {
        i--;
      } else {
        newBoard[x][y].tile = "Bomb";
      }
    }

    return newBoard;
  };

  //Tile loop is needed to open up big areas incases of 0s
  const tileLoop = (clickX: number, clickY: number, board: Tile[][]) => {
    let newBoard = [...board];
    let clickedTile = newBoard[clickX][clickY];

    //Checks for bomb
    if (clickedTile.tile == "Bomb") {
      clickedTile.tile = "BOOM";
      setGameOver(true);
      setEmote("./dead.gif");
    } else {
      //Checking in 3 by 3 area centered around original click
      clickX++;
      clickY++;
      let count = 0;
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          //try catch so it doesn't crash on edge checks
          try {
            if (board[clickX - x][clickY - y].tile == "Bomb") {
              count++;
            }
          } catch (error) {}
        }
      }
      clickX--;
      clickY--;
      //setting tile to the number of surrounding bombs
      clickedTile.tile = count;
      //possible flag chord fix
      if (clickedTile.flagged) {
        setFlagCount(flagCount - 1);
        clickedTile.flagged = false;
      }
      //after confirming there are no bombs the search loops in all directions
      //it does this until reaching a piece that touches a bomb
      if (count == 0 && clickX < 16 && clickY < 16) {
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            try {
              if (newBoard[clickX + 1 - x][clickY + 1 - y].tile) {
                newBoard = tileLoop(clickX + 1 - x, clickY + 1 - y, [
                  ...newBoard,
                ]);
              }
            } catch (error) {}
          }
        }
      }
    }
    return newBoard;
  };

  //starts loop on tile press and checks for win
  const tilePress = (clickX: number, clickY: number, board: Tile[][]) => {
    let clickedTile = board[clickX][clickY];
    if (
      (clickedTile.tile != "Bomb" && clickedTile.tile != "Clear") ||
      clickedTile.flagged
    ) {
      return;
    } else {
      let newBoard = tileLoop(clickX, clickY, board);
      setTurnCount(turnCount + 1);
      let win = true;
      let flags = 0;
      newBoard.forEach((row) => {
        row.forEach((tile: Tile) => {
          if (tile.tile == "Clear") win = false;
          if (tile.flagged) flags++;
        });
      });
      setFlagCount(flags);

      setWin(win);
      win && setEmote("./onWin.gif");
      return newBoard;
    }
  };

  const onFlag = (clickX: number, clickY: number) => {
    if (win) return;
    let newBoard = [...board];
    let tile = board[clickX][clickY].tile;
    if (board[clickX][clickY].flagged) {
      newBoard[clickX][clickY].flagged = false;
      setFlagCount(flagCount - 1);
    } else if (tile == "Bomb" || tile == "Clear") {
      newBoard[clickX][clickY].flagged = true;
      setFlagCount(flagCount + 1);
    }
    setBoard(newBoard);
  };

  const onClick = (clickX: number, clickY: number) => {
    //Makes the board after click
    if (firstMove) {
      let newBoard = makeBoard(clickX, clickY);
      let postClick = tilePress(clickX, clickY, newBoard);
      setFirstMove(false);
      setBoard(postClick);
      setLoading(false);
    }
    //rest of game loop
    else {
      //There is no setBoard state because react states are weird
      //states are immutable, but if a state is an array the contains ONLY
      //objects and the objects are changed, the state actually does reflect this
      //react does not realize that this state was changed, but it is in the array and on the frontend
      //basically during tile press the state is being changed without a setstate command
      !gameOver && !win && tilePress(clickX, clickY, board);
    }
  };
  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };
  const autoClick = (clickX: number, clickY: number) => {
    let cord = board[clickX][clickY];
    let boom = { hit: false, cords: [0, 0] };
    //Checking that the user did click a numbered tile
    if (!["BOOM", "Bomb", "Clear"].includes(cord.tile)) {
      //ammount of required flagged tiles for the function to continue
      let required = cord.tile;
      //total counted flags
      let count = 0;
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          try {
            let search = board[clickX + x][clickY + y];
            if (search != undefined) {
              //checking that the tile is flagged and not the clicked tile
              if (search.flagged) {
                count++;
              } else if (search.tile == "Bomb" && !search.flagged) {
                //if a tile is a bomb and not flagged, a false state is triggered
                boom = { hit: true, cords: [clickX + x, clickY + y] };
              }
            }
          } catch (error) {}
        }
      }
      if (count == required) {
        //clicks just the bomb incase of a fail
        if (boom.hit) {
          try {
            onClick(boom.cords[0], boom.cords[1]);
          } catch (error) {}
        } else {
          //if successfully flagged all bombs it clicks the rest of the tiles
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              try {
                onClick(clickX + x, clickY + y);
              } catch (error) {}
            }
          }
        }
      }
    }
  };
  //makes new board on start up
  useEffect(() => {
    clearBoard();
    setIsMobile(isMobileDevice());
  }, []);

  return (
    <>
      {!loading && (
        <>
          <VStack justifyContent="flex-end" alignItems="flex-start">
            <HStack mt="1em" gap="1em">
              <Box
                mr="1em"
                mb="1em"
                width="8em"
                height="8em"
                borderColor="gray.500"
                borderWidth="0.3em"
                borderRadius="1em"
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                backgroundImage={emote}
              ></Box>
              <VStack alignItems="flex-start">
                {" "}
                <div className={styles.sweepUI}>
                  <p>Flags Used: {flagCount}</p>
                  <button onClick={() => clearBoard()}>New</button>
                  {/* Game State Info */}
                  {win ? (
                    <p className={styles.win}>You Won!</p>
                  ) : gameOver ? (
                    <p className={styles.loss}>Game Over</p>
                  ) : (
                    ""
                  )}
                </div>
                <Settings bombs={bombs} setBombs={setBombs} />
              </VStack>
              {isMobile && (
                <button
                  className={flagToggle ? styles.on : styles.off}
                  onClick={() => setFlagToggle(!flagToggle)}
                >
                  <Icon as={BsFillFlagFill} />
                </button>
              )}
            </HStack>
            <Flex
              borderRadius="1em"
              userSelect="none"
              bgColor="gray.400"
              borderColor="gray.500"
              borderWidth={["0.5em", "1em"]}
              width="-moz-fit-content"
            >
              {/* Col */}
              <VStack gap={["1px", "3px"]}>
                {board.map((row: Tile[], x: number) => (
                  // Row
                  <HStack gap={["1px", "3px"]} key={x}>
                    {/* Start of tile section */}
                    {row.map((tile: Tile, y: number) => (
                      <Flex
                        cursor="pointer"
                        onMouseDown={() => {
                          !gameOver &&
                            !win &&
                            ["Clear", "Bomb"].includes(tile.tile.toString()) &&
                            setEmote("./onPress.png");
                        }}
                        onDoubleClick={(e) => {
                          autoClick(x, y);
                        }}
                        onMouseLeave={() => {
                    (!win&&!gameOver)&&setEmote("./Chilling.png");
                        }}
                        onMouseUp={() =>
                          !gameOver &&
                          !win &&
                          ["Clear", "Bomb"].includes(tile.tile.toString()) &&
                          setEmote("./Chilling.png")
                        }
                        _hover={{
                          backgroundColor:
                            tile.tile == "Clear" || tile.tile == "Bomb"
                              ? "rgb(212, 229, 255)"
                              : "",
                          transition: "0.25s",
                        }}
                        transition="0.5s"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          !firstMove && onFlag(x, y);
                        }}
                        justifyContent="center"
                        alignItems="center"
                        key={y}
                        onClick={() =>
                          !flagToggle
                            ? onClick(x, y)
                            : !firstMove && onFlag(x, y)
                        }
                        height={["1.42em", "3em"]}
                        width={["1.42em", "3em"]}
                        bgColor={
                          tile.tile == "0"
                            ? "gray.400"
                            : ["Clear", "Bomb"].includes(tile.tile.toString())
                            ? "gray.100"
                            : tile.tile == "BOOM"
                            ? "red"
                            : "gray.300"
                        }
                      >
                        <Text
                          color={color[tile.tile]}
                          fontSize={["l", "2xl"]}
                          fontWeight="extrabold"
                        >
                          {!["Clear", "BOOM", "Bomb", 0].includes(tile.tile) &&
                            tile.tile}
                          {(tile.tile == "BOOM" ||
                            ((win || gameOver) && tile.tile == "Bomb")) && (
                            <Icon
                              color={tile.tile == "BOOM" ? "white" : "black"}
                              as={GiLandMine}
                            />
                          )}
                          {tile.flagged &&
                            !win &&
                            !gameOver &&
                            (tile.tile == "Bomb" || tile.tile == "Clear") && (
                              <Icon
                                fontSize={["0.8em", "2xl"]}
                                as={BsFillFlagFill}
                              />
                            )}
                        </Text>
                      </Flex>
                    ))}
                  </HStack>
                ))}
              </VStack>
            </Flex>
          </VStack>
        </>
      )}
    </>
  );
};
export default Board;
