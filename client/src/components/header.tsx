import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Crown, Wand2, Settings, User, LogOut, History, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setLocation('/app')}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Promptify</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Templates
            </button>
            <button className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </button>
            <button className="text-gray-500 hover:text-blue-600 transition-colors">
              Help
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Pro
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="w-4 h-4 mr-2" />
                  Prompt History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation('/')}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-6">
                  <button className="text-gray-700 hover:text-gray-900 transition-colors text-left">
                    Templates
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 transition-colors text-left">
                    History
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 transition-colors text-left">
                    Help
                  </button>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Pro
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setLocation('/')}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
