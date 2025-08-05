import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { TextInput } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import {useNavigation } from '@react-navigation/native';

countries.registerLocale(enLocale);

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
type ForecastData = {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
};

export default function Api() {

  const navigation = useNavigation<any>()
  const [userInput, setUserInput] = useState('London');
  const [data, setData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const countryName = data?.sys?.country
    ? countries.getName(data.sys.country, 'en')
    : '';

 const getWeatherIcon = (weatherMain: string, description: string, iconCode: string) => {

  const desc = description.toLowerCase()

       switch (description) {
      case 'clear sky':
        return require('./assets/icons/sunny.png'); // Create this file
      case 'clouds':
        if (desc.includes('few clouds')) {
          return require('./assets/icons/cloudy.png');
        }
        return require('./assets/icons/cloud.png');
      case 'rain':
        if (desc.includes('light')) {
          return require('./assets/icons/light-rain.png');
        } else if (desc.includes('shower rain')) {
          return require('./assets/icons/heavy-rain.png');
        }
        return require('./assets/icons/rain.png');
      case 'drizzle':
        return require('./assets/icons/drizzle.png');
      case 'thunderstorm':
        return require('./assets/icons/thunderstorm.png');
      case 'snow':
        return require('./assets/icons/snow.png');
      case 'mist':
      case 'fog':
      case 'haze':
        return require('./assets/icons/mist.png');
      case 'dust':
      case 'sand':
        return require('./assets/icons/dust.png');
      case 'smoke':
        return require('./assets/icons/smoke.png');
      default:
        return require('./assets/icons/cloud.png'); // Fallback to your existing cloud icon
    }
  };
   const getForecastIcon = (item: any) => {
      return getWeatherIcon(item.weather[0].main, item.weather[0].description, item.weather[0].icon)
    }
    
  const getAPIData = async (city?: string) => {
    const searchCity = city || userInput;
    if (!searchCity.trim()) {
      Alert.alert('Error, Please enter a city name');
      return;
    }
    const getCurrentWeather = async (searchCity: string) => {
      const encodedCity = encodeURIComponent(searchCity.trim());
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=506c0cfa86a201611bffdd46909b17c0`;

      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        Alert.alert('Error', result.message || 'City not found');
        setData(null);
        setForecast(null);
      }
    };

    const getForecast = async (searchCity: string) => {
      const encodedCity = encodeURIComponent(searchCity.trim());
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=506c0cfa86a201611bffdd46909b17c0`;

      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setForecast(result);
      } else {
        Alert.alert('Error', result.message || 'City not found');
        setData(null);
        setForecast(null);
      }
    };
    setLoading(true);

    try {
      await Promise.all([
        getCurrentWeather(searchCity),
        getForecast(searchCity),
      ]);
    } catch (error) {
      const apiError : any = error
      // console.error('API Error', error);
       Alert.alert(`Error, failed to fetch weather data `,apiError);

    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    getAPIData();
  };
  useEffect(() => {
    getAPIData();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/weatherbg.png')}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.searchView}>
            <TextInput
              style={styles.input}
              onChangeText={setUserInput}
              value={userInput}
              placeholder="Enter City Name e.g Paris"
              onSubmitEditing={handleSearch}
              placeholderTextColor="#999"
              returnKeyType="search"
            />

            <TouchableOpacity onPress={handleSearch}>
              <Image
                source={require('./assets/search.png')}
                style={[styles.searchButton, loading && { opacity: 0.5 }]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.weatherContainer}>
            <View style={styles.showDetailsButton}>
              <Text style={styles.weatherText}>Today</Text>
              <TouchableOpacity>
                <Image
                  source={require('./assets/show.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : data ? (
              <>
                <View style={styles.row}>
                  <Image
                    source={getWeatherIcon(
                      data.weather[0]?.main,
                     data.weather[0]?.description,
                     data.weather[0]?.icon
                    )
                    }
                    style={styles.weatherIcon
                    }
                  />

                  <Text
                    style={{
                      fontSize: 70,
                      color: '#C9E8E0',
                      fontFamily: 'Poppins-SemiBold',
                    }}
                  >
                    {data?.main?.temp}
                  </Text>
                  <Image
                    source={require('./assets/degree.png')}
                    style={styles.degree}
                  />
                </View>

                <View style={styles.description}>
                  <Text style={styles.textBold}>{data.weather?.[0]?.main}</Text>

                  <View style={styles.row2}>
                    <Text style={styles.text}>{data.name}</Text>
                    {countryName && (
                      <Text style={styles.text}>, {countryName}</Text>
                    )}
                  </View>
                  <Text style={styles.text}>
                    Feels Like : {data?.main?.feels_like}
                  </Text>
                </View>

                <View style={styles.glassContainer}>
                  <BlurView
                    style={styles.blurContainer}
                    blurType="light" // or "dark", "extraLight", "extraDark"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                  />
                 
                  <View style={styles.tempRow}>
                    {forecast?.list?.slice(0, 5).map((item, index) => {
                      const date = new Date(item.dt * 1000);
                      const timeLabel =
                        index === 0
                          ? 'Now'
                          : date.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              hour12: true,
                            });
                            //rounding off the value
                      const temp = Math.round(item.main.temp);

                      return (
                        <View key={index} style={styles.forecastItem}>
                          <Text style={styles.forecastHours}>{timeLabel} </Text>
                          <Image source={getForecastIcon(item)} style={styles.forecastIcon}/>
                          <Text style={styles.forecastHours}>{temp}°</Text>
                        </View>

                      );
                    })}
                  </View>
                  <View style={styles.dividerLine} />
                  <View style={styles.tempRow}>
                    {forecast?.list?.slice(5, 10).map((item, index) => {
                      const date = new Date(item.dt * 1000);
                      const timeLabel = date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        hour12: true,
                      });
                      const temp = Math.round(item.main.temp);

                      return (
                        <View key={index + 5} style={styles.forecastItem}>
                          <Text style={styles.forecastHours}>{timeLabel}</Text>
                          <Image
                            source={getForecastIcon(item)}
                            style={styles.forecastIcon}
                          />
                          <Text style={styles.forecastHours}>{temp}°</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.textContainer}>
                <Text style={styles.randomHeading}>Weather Today</Text>
                  <Text style={styles.randomText}>

                    { data?
                    `Today the temperature in ${data.name} is ${data.main.temp}`
                  : 'Loading weather...' }
                  </Text>
                  
                  
                </View>
              </>
            ) : (
              <Text style={styles.errorText}>No weather data available</Text>
            )}
          </View>
          {/* <TouchableOpacity onPress={()=> {navigation.navigate('mapList')}}><Text>navigate</Text></TouchableOpacity> */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    marginHorizontal: 10,
    width: '90%',
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },

  weatherContainer: {
    backgroundColor: '#40666A',
    width: 340,
    height: 350,
    borderRadius: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 14,
  },
  textBold: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#C9E8E0',
    marginTop: 10,
    alignSelf: 'center',
  },
  temperatureText: {
    fontSize: 70,
    color: '#C9E8E0',
    fontFamily: 'Poppins-SemiBold',
  },

  loadingText: {
    fontSize: 18,
    color: '#C9E8E0',
    fontFamily: 'Poppins-Regular',
    marginTop: 100,
  },

  errorText: {
    fontSize: 16,
    color: '#C9E8E0',
    fontFamily: 'Poppins-Regular',
    marginTop: 100,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#C9E8E0',
    marginTop: 10,
    alignSelf: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherText: {
    color: '#C9E8E0',
    fontSize: 22,
    // marginTop: 0,
    fontFamily: 'Poppins-Medium',
  },
  showDetailsButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    marginLeft: 10,
    width: 14,
    height: 14,
    tintColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  weatherIcon: {
    // marginLeft : 10,
    width: 64,
    height: 64,
    marginHorizontal: 15,
    // tintColor: '#fff'
  },
  degree: {
    width: 13,
    height: 13,
    marginTop: -60,
    marginLeft: 10,
  },
  description: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchView: {
    width: '100%',
    height: 60,
    marginTop: 70,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 25,
    width: '95%',
    color: '#C9E8E0',
    height: 50,
  },
  searchButton: {
    width: 30,
    height: 30,
    right: 10,
    top: -13,
    position: 'absolute',
  },
  glassContainer: {
    top: 370,
    left: 0,
    borderRadius: 25,
    overflow: 'hidden',
    width: 350,
    height: 230,
    position: 'absolute',
    backgroundColor: 'rgba(64, 102, 106, 0.4)',
    alignItems: 'center',
    // backgroundColor : 'red'
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  randomHeading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
  },
  randomText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop : 0
  },
  textContainer: {
    marginTop: 320,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  tempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal : 12,
    marginTop: 20,
  },
  forecastHours: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  forecastIcon: {
    width: 32,
    height: 32,
  },
  dividerLine: {
    width: '85%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 5,
  },
    forecastItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    // backgroundColor : 'orange',
    
  },
    
});
 {/* <View style={styles.tempRow}>
                    <Text style={styles.forecastHours}>Now </Text>
                    <Text style={styles.forecastHours}>12 PM </Text>
                    <Text style={styles.forecastHours}>3 PM</Text>
                    <Text style={styles.forecastHours}>6 PM</Text>
                    <Text style={styles.forecastHours}>9 PM</Text>
                  </View>
                  <View style={styles.tempRow}>
                    {forecast?.list?.slice(0, 5).map((item, index) => {
                      const temp = Math.round(item.main.temp);
                      return (
                        <Text key={index} style={styles.forecastHours}>
                          {temp}°
                        </Text>
                      );
                    })}
                  </View> */}

                  {/* <Text style={{ color: '#ffffff' }}>
                    --------------------------------------------
                  </Text> */}