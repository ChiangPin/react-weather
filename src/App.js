import "./App.css";
import { useState } from "react";

const api = {
	key: "e24595e048d1ce3e52e031b5840dd923",
	baseUrl: "https://api.openweathermap.org/data/2.5/",
};

function App() {
	const [query, setQuery] = useState("");
	const [weather, setWeather] = useState({});

	let weatherHistory = [];
	if (localStorage.getItem("weather-history")) {
		weatherHistory = JSON.parse(localStorage.getItem("weather-history"));
	}

	function getWeatherHistory() {
		return weatherHistory;
	}

	const search = (evt) => {
		if (evt.key === "Enter") {
			fetch(`${api.baseUrl}weather?q=${query}&units=metric&APPID=${api.key}`)
				.then((res) => res.json())
				.then((result) => {
					if (result.cod !== "404") {
						weatherHistory = [...weatherHistory];
						setWeather(result);
						setQuery("");
						weatherHistory.push(result);
						weatherHistory = [...weatherHistory];

						console.log(weatherHistory);
						localStorage.setItem(
							"weather-history",
							JSON.stringify(weatherHistory)
						);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const dateBuilder = (d) => {
		let months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		let days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		let day = days[d.getDay()]; // 0-6
		let date = d.getDate();
		let month = months[d.getMonth()]; // 0-11
		let year = d.getFullYear();

		return `${day} ${date} ${month} ${year}`;
	};

	function getDate(milliseconds) {
		let date = new Date(milliseconds).toLocaleTimeString();
		return date.toString();
	}

	return (
		<div
			className={
				typeof weather.main != "undefined"
					? weather.main.temp > 16
						? "app warm"
						: "app"
					: "app"
			}
		>
			<main>
				<div className="search__box">
					<input
						type="text"
						className="search__bar"
						placeholder="Search location..."
						onChange={(e) => setQuery(e.target.value)}
						value={query}
						onKeyPress={search}
					></input>
				</div>
				{typeof weather.main != "undefined" ? (
					<div className="main-content">
						<div className="location-box">
							<div className="location">
								{weather.name}, {weather.sys.country}
							</div>
							<div className="date">
								{dateBuilder(new Date())} (
								{getDate(weather.dt * 1000 + weather.timezone * 1000)})
							</div>
						</div>
						<div className="weather-box">
							<div className="temp">{weather.main.temp.toFixed(1)}°c</div>
							<div className="weather">{weather.weather[0].main}</div>
							<div className="humidity">Humidity: {weather.main.humidity}%</div>
						</div>
					</div>
				) : (
					<div className="main-content"></div>
				)}

				<div className="history-box">
					<h2 className="history-title">Search History</h2>
					<ol style={{ overflowY: "auto" }}>
						{getWeatherHistory().map((location, index) => {
							return (
								<li className="history-list" key={index}>
									{index + 1}.&nbsp;
									<span className="history-location">
										{location.name}, {location.sys.country}
									</span>
									<span className="history-time">{getDate(location.dt)}</span>
								</li>
							);
						})}
					</ol>
				</div>
			</main>
		</div>
	);
}

export default App;
