import Image from 'next/image'
import styles from './page.module.css'
import { Flex } from '@chakra-ui/react'
import Board from '../../components/Board'
import HowTo from '../../components/HowTo'

export default function Home() {
  return (
    <Flex flexDirection='column' justifyContent='center' alignItems='center'>
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@500&display=swap" rel="stylesheet"/>
   
    <Board/>
    <HowTo/>
 </Flex> 
  )
}
