import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Syn_Taxx
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-2">
              <NavigationMenuItem>
                <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                  <Link href="#about">About</Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                  <Link href="#projects">Projects</Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                  <Link href="#contact">Contact</Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}