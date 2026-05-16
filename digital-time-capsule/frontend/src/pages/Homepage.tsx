import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Lock, Image, Calendar, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Clock className="w-8 h-8 text-purple-600" />
                <div className="absolute -inset-1 bg-purple-400 rounded-full blur-sm opacity-20 -z-10"></div>
              </div>
              <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Capsula
              </span>
            </div>
            <div className="flex gap-3">
              {isLoggedIn ? (
                <Button onClick={() => navigate("/capsules")}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-10"></div>

        <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
          <span className="text-sm font-medium text-purple-700 flex items-center gap-1 justify-center">
            <Sparkles className="w-4 h-4" /> Preserve Your Precious Moments
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Store Your Memories
          <br />
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Open Them Later
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create capsules filled with messages, photos, and memories. Set a future date and unlock them when the time comes.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 px-8 py-6 text-lg h-auto"
          >
            Get Started for Free
          </Button>
          {!isLoggedIn && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-2 px-8 py-6 text-lg h-auto"
            >
              Sign In
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your digital time capsule in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-purple-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Create a Capsule
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Start by creating a new time capsule with a meaningful title
              </p>
            </div>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-blue-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Image className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Add Content
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload messages, photos, and precious memories you want to preserve
              </p>
            </div>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-pink-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Set Opening Date
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Choose a future date when you want to unlock and view your capsule
              </p>
            </div>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-green-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Wait & Open
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Watch the countdown and open your capsule when the special day arrives
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
          <div className="relative p-12 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Ready to Create Your First Capsule?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Join thousands of people preserving their memories for the future
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl px-8 py-6 text-lg h-auto font-semibold"
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 Capsula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
