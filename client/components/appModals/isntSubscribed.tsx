import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { BlurView } from 'expo-blur'
import { unsureMascot } from '../../assets/icons/icons';
import { SvgXml } from 'react-native-svg';

const isntSubscribed = () => {
  return (
    <View className='flex-1 justify-center items-center bg-dark1/50 relative'>
        <BlurView intensity={20} tint='dark' className='absolute inset-0' />

        <View className='w-fullflex flex-col justify-center items-center gap-2 bg-dark1 p-8 rounded-3xl'>
        <SvgXml xml={unsureMascot} width={64} height={64} />

          <Text className='text-light1  text-xl font-medium text-center mt-2'>You are not subscribed to the app</Text>
          <Text className='text-light2 font-sans text-center'>Please delete the app and reinstall it to continue</Text>
         
        </View>
      </View>
    );
};

export default isntSubscribed;
