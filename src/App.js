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
		console.log(weatherHistory);
	}

	const search = (evt) => {
		if (evt.key === "Enter") {
			fetch(`${api.baseUrl}weather?q=${query}&units=metric&APPID=${api.key}`)
				.then((res) => res.json())
				.then((result) => {
					setWeather(result);
					setQuery(""); //reset query
					//localStorage.setItem('weather-history', (result))
					weatherHistory.push(result);
					localStorage.setItem(
						"weather-history",
						JSON.stringify(weatherHistory)
					);
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
					<div>
						<div className="location-box">
							<div className="location">
								{weather.name}, {weather.sys.country}
							</div>
							<div className="date">{dateBuilder(new Date())}</div>
						</div>
						<div className="weather-box">
							<div className="temp">{weather.main.temp.toFixed(1)}°c</div>
							<div className="weather">{weather.weather[0].main}</div>
						</div>
					</div>
				) : (
					""
				)}

				<div className="history-box">
					<h2 className="history-title">Search History</h2>
					<ol>
						{weatherHistory.map((location, index) => {
							return (
								<li key={index}>
									<span>
										{location.name}, {location.sys.country}
									</span>
									<span>Date here</span>
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
