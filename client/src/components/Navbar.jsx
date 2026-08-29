function Navbar() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 text-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          K
        </div>

        <span className="text-gray-300">
          User
        </span>
      </div>
    </header>
  );
}

export default Navbar;