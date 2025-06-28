import Form from "next/form";
import { Search, Sparkles } from "lucide-react";
import SearchFormReset from "./SearchFormReset";

interface SearchFormProps {
  query?: string | undefined;
}

const SearchForm = ({ query }: SearchFormProps) => {
  return (
    <Form
      action="/"
      scroll={false}
      className="search-form max-w-3xl w-full min-h-[80px] bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl text-[20px] mt-8 px-8 flex items-center gap-4 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      role="search"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search for games
          </label>
          <input
            id="search-input"
            name="query"
            defaultValue={query}
            className="flex-1 font-medium placeholder:font-medium placeholder:text-gray-500 w-full h-auto outline-none bg-transparent"
            placeholder="Search for games, developers, or categories..."
            aria-label="Search for games"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            maxLength={100}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Sparkles className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {query && <SearchFormReset />}

        <button
          type="submit"
          className="size-[50px] rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex justify-center items-center transition-all duration-200 hover:scale-110 shadow-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Search"
        >
          <Search className="size-5" aria-hidden="true" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
