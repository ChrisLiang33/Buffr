function UserBank({ bankName, accountType, lastThree, iconUrl }) {
  return (
    <>
      <div className="flex gap-5 self-stretch px-4 py-2 whitespace-nowrap bg-slate-50 rounded-[999px]">
        <div className="flex gap-3 justify-between">
          <img loading="lazy" src={iconUrl} className="w-12 aspect-square" />
          <div className="flex flex-col flex-1 justify-center my-auto">
            <div className="text-base font-medium leading-6 text-slate-800">
              {bankName}
            </div>
            <div className="flex gap-2 justify-between text-sm leading-5 text-slate-600">
              <div className="grow">{accountType}</div>
              <div className="flex-auto">..{lastThree}</div>
            </div>
          </div>
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ffbfe0ffafd8cb4673fe7f2d1de3505bdffbbe9d22d62533afa350328358ee78?"
          className="my-auto aspect-square w-[18px]"
        />
      </div>
      <br />
    </>
  );
}
export default UserBank;
