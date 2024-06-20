import "./HeaderNav.scss";
import { Link } from "react-router-dom";

function HeaderNav() {
	return (
		<header>
			<nav className="header-nav">
				<div className="header__image__wrapper">
					<Link to="/">
						<img
							className="dinesafe-icon"
							src="/src/assets/icon.jpg"
							alt="Dinesafe Logo"
						/>
					</Link>
				</div>
				<p className="dinesafe-title">DineSafe Toronto</p>
				<div className="nav-links">
					<p>About</p>
					<p>Contact</p>
				</div>
			</nav>
		</header>
	);
}
export default HeaderNav;
