import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
type WeatherData = {
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  // add other fields as needed

  // wind: {
  //   speed: number;
  //   deg: number;
  //   gust: number;
  // };
  coord: {
    lon: number;
    lat: number;
  };
  // visibility: number;
  // base: string;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };

  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;

  clouds: {
    all: number;
  };

  timezone: number;
  id: number;
  name: string;
  cod: number;
};
export default function MapList() {

  const navigation = useNavigation<any>()
  const [data, setData] = useState<any[]>([]);

  const getAPIData = async (searchCity: string = 'Karachi') => {
    const encodedCity = encodeURIComponent(searchCity!.trim());
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=506c0cfa86a201611bffdd46909b17c0`;
    const result = await fetch(url);
    const response = await result.json();
    console.log('Response', response);
    setData(response.list);
  };

  useEffect(() => {
    getAPIData();
  }, []);

  return (

      <View style={styles.container}>
        <Text style={styles.text}>List With Api Call</Text>
               <TouchableOpacity onPress={() => {navigation.navigate('List')}}> <Text>navigate</Text> </TouchableOpacity>
       <ScrollView> {
         
          data? 
           
            data.map((item) => 
              <View key={item.id} style={styles.dataContainer}>
                <Text style={styles.idText}> 
                 { item.weather[0].id}
               </Text> 
              </View>
              
          ) 
          : <Text>no data available</Text>
         
        } </ScrollView>
        </View>
     
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent : 'center',
    backgroundColor: 'red',
   marginBottom : 50
  },

  dataContainer : {
flex : 0.3,
backgroundColor : "blue",
width : 200,
marginBottom : 10
  },
  text: {
    marginTop: 120,
    fontSize: 25,
  },
  idText:{
    fontSize : 18,
  }
});
