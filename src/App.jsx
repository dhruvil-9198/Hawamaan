"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  WiDaySunny,
  WiWindDeg,
  WiNightAltCloudy,
  WiSunset,
  WiSunrise,
  WiSprinkle,
  WiWindy,
  WiStrongWind,
} from "react-icons/wi"
import { FaEye } from "react-icons/fa"

function App() {
  const [show, setshow] = useState(false)
  const [show1, setshow1] = useState("See More")
  const [name, setname] = useState("")
  const [data, setData] = useState([])
  const [debouncedqry, setDebouncedqry] = useState("")
  const [selectedOption, setSelectedOption] = useState({
    place_id: "322328026437",
    osm_id: "1950886",
    osm_type: "relation",
    licence: "https://locationiq.com/attribution",
    lat: "23.2819525",
    lon: "72.65363085",
    boundingbox: ["22.9963339", "23.5675802", "72.3362133", "73.0294494"],
    class: "boundary",
    type: "administrative",
    display_name: "Gandhinagar, Gujarat, India",
    display_place: "Gandhinagar",
    display_address: "Gujarat, India",
    address: {
      name: "Gandhinagar",
      state: "Gujarat",
      country: "India",
      country_code: "in",
    },
  })
  const [weather1, setWeather1] = useState([])
  const [hourly, setHourly] = useState([])
  const [aqi, setAqi] = useState([])

  // Debounce the name to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedqry(name)
    }, 500)

    return () => clearTimeout(handler)
  }, [name])

  // Fetch location data based on the debounced name
  useEffect(() => {
    if (debouncedqry.trim() === "") {
      setData([])
      return
    }

    const fetchLocations = async () => {
      const options = { method: "GET", headers: { accept: "application/json" } }
      try {
        const res = await fetch(
          `https://us1.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_Loc_KEY}&q=${debouncedqry}`,
          options,
        )
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      }
    }

    fetchLocations()
  }, [debouncedqry])

  // Handle option selection
  const handleSelect = (option) => {
    setSelectedOption(option)
    setname("") // Update the input field with the selected option
    setData([]) // Clear the dropdown after selection
  }

  useEffect(() => {
    const url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily?lat=${selectedOption.lat}&lon=${selectedOption.lon}&units=metric&lang=en`
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": `${import.meta.env.VITE_rap_KEY}`,
        "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
      },
    }

    const url2 = `https://weatherbit-v1-mashape.p.rapidapi.com/current?lat=${selectedOption.lat}&lon=${selectedOption.lon}&lang=en`
    const options2 = {
      method: "GET",
      headers: {
        "x-rapidapi-key": `${import.meta.env.VITE_rap_KEY}`,
        "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
      },
    }

    const url1 = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/hourly?lat=${selectedOption.lat}&lon=${selectedOption.lon}&lang=en&hours=24&units=metric`
    const options1 = {
      method: "GET",
      headers: {
        "x-rapidapi-key": `${import.meta.env.VITE_rap_KEY}`,
        "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
      },
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch(url, options)
        const json = await res.json()
        setWeather1(json)

        const res2 = await fetch(url2, options2)
        const json2 = await res2.json()
        setAqi(json2)

        const res1 = await fetch(url1, options1)
        const json1 = await res1.json()
        setHourly(json1)
      } catch (err) {
        console.error(err)
      }
    }

    fetchWeather()
  }, [selectedOption])

  function getWeatherIcon(code) {
    return `/${code}.png`
  }

  function convertUTCtoIST(utcTime) {
    // Split HH:MM
    let [hours, minutes] = utcTime.split(":").map(Number)

    // Add 5 hours 30 minutes for IST
    hours += 5
    minutes += 30

    // Handle overflow (e.g., 23:45 UTC → 05:15 IST next day)
    if (minutes >= 60) {
      minutes -= 60
      hours += 1
    }
    if (hours >= 24) {
      hours -= 24 // Wrap around to the next day
    }

    // Format with leading zeros
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  function datefor(date) {
    const dt = date.substring(0, 10)
    const d = new Date(dt)
    let day = d.getDate()
    let month = d.getMonth() + 1
    let year = d.getFullYear()
    if (day < 10) day = "0" + day
    if (month < 10) month = "0" + month
    year = year.toString().substr(-2)
    return `${day}/${month}/${year}`
  }

  function lcltime(utcTime) {
    const hrs = utcTime.substring(11, 13)
    return `${hrs}:00`
  }

  function getday(dateString) {
    const date = new Date(dateString)

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })

    return dayName.substring(0, 3)
  }

  const handlechg = () => {
    setshow(!show)
    if (show) {
      setshow1("See More")
    } else {
      setshow1("See Less")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {selectedOption.length == 0 || weather1.length == 0 || aqi.length == 0 || hourly.length == 0 ? (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <WiNightAltCloudy size={100} className="text-blue-400 animate-pulse" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mt-4 text-gray-300 text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Welcome to <span className="text-blue-400">Hawamaan</span>
          </motion.h1>

          <motion.p
            className="mt-3 text-base md:text-lg text-gray-400 text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Gathering the latest weather insights...
          </motion.p>

          <motion.div
            className="mt-6 w-20 h-1 bg-blue-400 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" }}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-6">
          <div className="w-full lg:w-2/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a location"
                className="w-full md:w-2/3 p-2 pl-4 mb-4 md:mb-8 bg-gray-800 rounded-xl"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              {data.length > 0 && (
                <ul className="absolute w-full md:w-2/3 mt-1 bg-gray-950 rounded-xl overflow-y-auto scrollbar-hide shadow-lg z-50 max-h-60">
                  {data.map((item) => (
                    <li
                      className="cursor-pointer p-2 hover:bg-gray-700"
                      key={item.place_id}
                      onClick={() => handleSelect(item)}
                    >
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div>
                  <div className="text-2xl md:text-3xl font-bold">{selectedOption.address.name}</div>
                  <div className="text-5xl md:text-6xl mt-2 md:mt-6 font-bold">{aqi.data[0].app_temp}°</div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-8">
                  <img
                    src={getWeatherIcon(aqi.data[0].weather.icon) || "/placeholder.svg"}
                    alt=""
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                  <div className="text-sm md:text-base">{aqi.data[0].weather.description}</div>
                </div>
              </div>

              {/* Hourly Forecast */}
              {!show && (
                <div className="my-5 bg-gray-800 pt-4 px-2 pb-4 rounded-xl">
                  <h2 className="ml-4 text-lg md:text-xl font-bold mb-2">Today's weather</h2>
                  <div className="flex divide-x divide-gray-600 overflow-x-auto scrollbar-hide pb-2">
                    {hourly.data.map((item) => (
                      <div
                        key={item.ts}
                        className="text-center px-4 md:px-6 flex flex-col items-center gap-2 min-w-[80px]"
                      >
                        <p className="text-sm md:text-base">{lcltime(item.datetime)}</p>
                        <img
                          src={getWeatherIcon(item.weather.icon) || "/placeholder.svg"}
                          alt=""
                          className="w-10 h-10 md:w-13 md:h-13"
                        />
                        <p className="text-lg md:text-xl font-bold">{item.app_temp}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="my-6 bg-gray-800 pt-4 px-2 pb-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="ml-4 text-lg md:text-xl font-bold">Air Conditions</div>
                  <button
                    onClick={handlechg}
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 rounded-full px-3 md:px-5 py-1 text-center text-sm md:text-base"
                  >
                    {show1}
                  </button>
                </div>

                {!show && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 md:px-8">
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiStrongWind />
                        Wind
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].wind_spd} Km/h</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiDaySunny />
                        UV Index
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].uv}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiSprinkle /> Precipitation
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].precip} %</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiSunrise />
                        Sunrise
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{convertUTCtoIST(aqi.data[0].sunrise)}</div>
                    </div>
                  </div>
                )}

                {show && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 md:px-8">
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiStrongWind />
                        Wind Speed
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].wind_spd} km/h</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiWindDeg /> Wind Direction
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].wind_cdir_full}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiWindy />
                        AQI
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].aqi}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiDaySunny />
                        UV Index
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].uv}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiSprinkle />
                        Precipitation
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].precip} %</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <FaEye /> Visibility
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{aqi.data[0].vis} Km</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiSunrise /> Sunrise
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{convertUTCtoIST(aqi.data[0].sunrise)}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base md:text-xl font-semibold flex gap-2 items-center">
                        <WiSunset />
                        Sunset
                      </div>
                      <div className="text-xl md:text-2xl font-bold pl-6">{convertUTCtoIST(aqi.data[0].sunset)}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Weekly Forecast Sidebar */}
          <div className="w-full lg:w-1/3 bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-3">16-Day Forecast</h2>
            <div className="flex flex-col pr-2 overflow-y-auto scrollbar-hide bg-scroll scroll-auto max-h-[400px] lg:max-h-[570px] divide-y divide-gray-600">
              {weather1 &&
                weather1.data.map((item) => (
                  <div
                    key={item.datetime}
                    className="grid grid-cols-5 items-center text-center py-4 text-sm md:text-base"
                  >
                    <div className="text-center">{datefor(item.valid_date)}</div>
                    <div className="text-center">{getday(item.valid_date)}</div>
                    <div className="text-center">
                      <img
                        src={getWeatherIcon(item.weather.icon) || "/placeholder.svg"}
                        alt=""
                        className="w-10 h-10 mx-auto"
                      />
                    </div>
                    <div className="text-center hidden sm:block">{item.weather.description}</div>
                    <div className="text-center col-span-2 sm:col-span-1">
                      {Math.round(item.high_temp)}/{Math.round(item.low_temp)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

