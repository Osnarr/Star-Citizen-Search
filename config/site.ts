export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "SpaceHelper Search",
	description: "",
	navItems: [
		{
			label: "Home",
			href: "https://spacehelper.xyz",
		},
		{
			label: "Docs",
			href: "https://docs.spacehelper.xyz",
		},
		

	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		"/logout",
		{
		},
	],
	links: {
		github: "https://github.com/osnarr",
		
	},
};
