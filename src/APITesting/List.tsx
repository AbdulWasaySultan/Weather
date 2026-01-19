Author - Abdul Wasay

import React, { useEffect, useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { StyleSheet } from 'react-native';
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
// const renderItem = (item? : string) => {}
export default function List() {
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
       <Text>Flat List With Api Call</Text>
     
     
      <View style={styles.listContainer}>
        
        {data.length > 0 ?(
      <FlatList
      data={data}
       // isme ham key define krrhe hein flatlist ko aik unique id deni prhti ha taake
          //  wo har line ka data ushi ki jagah pr map krske idher hamne usko aik variable
          //  index dediya aur us index ko string mein change kiya ha .toString() krke
          keyExtractor={index => index.toString()}
          renderItem={({item})=> (
             <View style={styles.item}>
              <Text style={styles.idText}>Weather ID: {item.weather[0]?.id}</Text>
              <Text style={styles.idText}>Description: {item.weather[0]?.description}</Text>
            </View>
        )}
      /> 
        ): (<Text>no data</Text>)}
        </View>
     </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent : 'center',
    backgroundColor: 'blue',
   marginBottom : 50
  },
  text: {
    marginTop: 120,
    fontSize: 25,
  },
  idText:{
    fontSize : 18,
  },
  listContainer : {
    justifyContent : 'center',
    alignItems :'center',
    flex : 0.8
  },
  item: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
});
