import ModeDropdown from "./ModeDropdown";
import OriginDropdown from "./OriginDropdown";
import ChainDropdown from "./ChainDropdown";

export default function Dropdown({
  chainCount,
  originCount,
}: {
  chainCount: any;
  originCount: any;
}) {
  return (
    <div className="flex flex-col border border-[#3c3f41] w-[100%] rounded-xl px-5 pt-4 ">
      <ModeDropdown />
      <div className="h-[1px] bg-[#3c3f41]  "></div>
      <OriginDropdown count={originCount} />
      <div className="h-[1px] bg-[#3c3f41]  "></div>
      <ChainDropdown count={chainCount} />
    </div>
  );
}
