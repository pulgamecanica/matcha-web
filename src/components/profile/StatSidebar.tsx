type StatSidebarProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function StatSidebar({ visible, title, onClose, children }: StatSidebarProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="ml-auto w-[100px] sm:w-[240px] h-full bg-white dark:bg-gray-900 p-6 shadow-lg animate-slide-in-right">
        <button
          onClick={onClose}
          className="text-right w-full text-sm text-pink-400 hover:underline"
        >
          Close
        </button>
        <div
          className='mt-4'>
          <h2 className="text-lg font-semibold mb-2 capitalize">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
