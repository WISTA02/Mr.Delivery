
import { useColorMode } from '@chakra-ui/color-mode';
import{Button}from'@chakra-ui/button';
import {SunIcon, MoonIcon } from '@chakra-ui/icons'

const ToggleColorMode = () => {
    const {colorMode,toggleColorMode}=useColorMode();
  return (
    <>
    <Button onClick={()=> toggleColorMode()} pos='absolute' top='0' right='0' m='1rem'>
        {colorMode ==='dark'?<SunIcon color='yellow.700' />:<MoonIcon color='blue.700'/>}</Button>
    </>
  )
}

export default ToggleColorMode