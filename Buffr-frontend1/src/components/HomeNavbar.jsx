import SearchBar from "./SearchBar";
import NotificationBtn from "./NotificationBtn";
import SettingBtn from "./SettingBtn";

const HomeNavbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <SearchBar />
      <div className="flex items-center space-x-4">
        <NotificationBtn />
        <SettingBtn />
      </div>
    </div>
  );
};

export default HomeNavbar;
