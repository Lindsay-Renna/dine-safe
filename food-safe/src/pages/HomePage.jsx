import "./HomePage.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderNav from "../Components/NavBar/HeaderNav";
import Hero from "../Components/Hero/Hero";
import RestaurantSearch from "../Components/RestaurantSearch/RestaurantSearch";

function HomePage() {
	return (
		<>
			<HeaderNav />
			<Hero />
			<main>
				<RestaurantSearch />
			</main>
		</>
	);
}

export default HomePage;
