export default function Header() {
    return (
        <header> 
            {/* 图片靠左，文字紧贴图片和图片中心位于同一水平线 */}
            <img src="/img.png" alt="Profile Picture" 
                className="rounded-full 
                    mb-4 w-12 h-12
                " 
                />
            <h1 className="text-gray-600 dark:text-gray-400 mt-2">
                Foracy's Blog
            </h1>
        </header>
    );
}