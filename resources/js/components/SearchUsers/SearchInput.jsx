import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { searchUsers, setSearchResults } from '../../store/UserStore';


const Search = () => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const {profile}=useSelector(state=>state.profile);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const dispatch = useDispatch();
  const { searchResults, searchLoading, searchError } = useSelector(state => state.user);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(setSearchResults([]));
      setFilteredUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchUsers(query));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }

    if (Array.isArray(searchResults)) {
      const filtered = searchResults.filter(user =>
        user.name && user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchResults, query]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(!!value.trim());
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleResultClick = () => {
    setQuery('');
    setShowResults(false);
    setFilteredUsers([]);
    dispatch(setSearchResults([]));
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-sm">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск пользователей"
            value={query}
            onChange={handleSearchChange}
            onFocus={() => query.trim() && setShowResults(true)}
            onBlur={handleBlur}
            className="
            w-66
            m-2
             sm:w-full
              px-4 py-2.5
              pl-10
              text-sm
              bg-white
              dark:bg-gray-900
              border-2
              border-gray-200
              dark:border-gray-700
              rounded-full
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              dark:focus:ring-blue-400
              transition-all
              duration-200
              placeholder-gray-500
              dark:placeholder-gray-400
              text-gray-900
              dark:text-gray-100
            "
            aria-label="Поиск пользователей"
          />

        </div>

        {showResults && query && (
          <div className="
            absolute
            top-full
            left-0
            right-0
            mt-2
            bg-white
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            rounded-xl
            shadow-lg
            max-h-96
            overflow-y-auto
            z-50
            animate-in
            fade-in-0
            zoom-in-95
          ">
            {searchLoading ? (
              <div className="p-4 text-center">
                <div className="
                  inline-block
                  h-5 w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-solid
                  border-current
                  border-r-transparent
                  motion-reduce:animate-[spin_1.5s_linear_infinite]
                "></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Поиск...
                </p>
              </div>
            ) : searchError ? (
              <div className="p-4 text-center text-red-500 dark:text-red-400 text-sm">
                {searchError}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="py-1">
                {filteredUsers.map(user => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="
                      flex
                      items-center
                      px-4
                      py-3
                      hover:bg-gray-50
                      dark:hover:bg-gray-700
                      transition-colors
                      duration-150
                      border-b
                      border-gray-100
                      dark:border-gray-700
                      last:border-b-0
                    "
                    onClick={handleResultClick}
                    aria-label={`Перейти к профилю ${user.name}`}
                  >
                    <div className="
                      relative
                      w-10
                      h-10
                      rounded-full
                      overflow-hidden

                      mr-3
                    ">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'
                          }
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;

                          }}
                        />
                      ) : (
                        <div className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center

                          from-blue-500
                          to-purple-600
                          text-white
                          font-semibold
                          text-sm
                        ">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-gray-100
                        truncate
                      ">
                        {user.name}
                      </div>
                      {user.email && (
                        <div className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                          truncate
                        ">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-1">
                  👥
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Пользователи не найдены
                </p>
                {query && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    По запросу "{query}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;