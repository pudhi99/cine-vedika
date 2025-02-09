import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

// Helper function to clean wiki markup
const cleanWikiText = (text) => {
  if (!text) return null;
  return text
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, "$1")
    .replace(/<ref[^>]*>.*?<\/ref>/g, "")
    .replace(/\{\{.*?\}\}/g, "")
    .replace(/<br\s*\/?>/g, ", ")
    .trim();
};

// Enhanced field extraction
const extractField = (text, field) => {
  const patterns = [
    `\\|\\s*${field}\\s*=\\s*([^\\n|]+)`,
    `\\|\\s*${field}\\s*=\\s*\\{\\{INR\\|([^}]+)\\}\\}`,
    `\\|\\s*${field}\\s*=\\s*\\[\\[([^\\]]+)\\]\\]`,
    `\\|\\s*${field}\\s*=\\s*([^\\n}|]*(?:\\n[^\\n}|]+)*)`,
  ];

  for (const pattern of patterns) {
    const regex = new RegExp(pattern);
    const match = text.match(regex);
    if (match) {
      return cleanWikiText(match[1]);
    }
  }
  return null;
};

// Enhanced money extraction
const extractMoney = (text, field) => {
  const patterns = [
    `\\|\\s*${field}\\s*=\\s*\\{\\{INR\\|([^}]+)\\}\\}`,
    `\\|\\s*${field}\\s*=\\s*₹([^\\n|]+)`,
    `\\|\\s*${field}\\s*=\\s*([^\\n|]+)(?=\\n|\\|)`,
  ];

  for (const pattern of patterns) {
    const match = text.match(new RegExp(pattern));
    if (match) {
      let value = match[1]
        .trim()
        .replace(/\{\{ndash\}\}/g, "–")
        .replace(/<ref[^>]*>.*?<\/ref>/g, "")
        .replace(/\{\{INR\|/g, "")
        .replace(/\}\}/g, "");

      // Add ₹ symbol if not present
      if (!value.includes("₹")) {
        value = `₹${value}`;
      }

      // Add 'crore' if not present and value doesn't contain a range
      if (!value.toLowerCase().includes("crore") && !value.includes("–")) {
        value = `${value} crore`;
      }

      return value;
    }
  }
  return null;
};

// Enhanced runtime extraction
const extractRuntime = (text) => {
  const runtimeMatch = text.match(/\|\s*runtime\s*=\s*([^\n<]+)/);
  if (runtimeMatch) {
    const runtime = runtimeMatch[1].replace(/<ref[^>]*>.*?<\/ref>/g, "").trim();
    return runtime;
  }
  return null;
};

// Enhanced cast extraction
const extractCast = (text) => {
  let castSection = text.match(
    /==\s*Cast\s*==\s*\{\{cast listing\|([\s\S]*?)\}\}/
  );
  console.log(
    castSection,
    "castSection ========castSection===========castSection======="
  );
  if (!castSection) {
    castSection = text.match(/==\s*Cast\s*==\s*\n([\s\S]*?)(?=\n==|$)/);
  }

  if (!castSection) return [];

  const castLines = castSection[1]
    .split("\n")
    .filter((line) => line.trim().startsWith("*"));

  return castLines
    .map((line) => {
      const patterns = [
        /\*\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]\s*as\s*([^\n<]+)/,
        /\*\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]\s*in(?:\s*the)?\s*role\s*of\s*([^\n<]+)/,
        /\*\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]\s*(?:–|-)\s*([^\n<]+)/,
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          return {
            name: cleanWikiText(match[1]),
            role: cleanWikiText(match[2]),
          };
        }
      }

      // Fallback for simpler formats
      const simpleMatch = line.match(/\*\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
      if (simpleMatch) {
        return {
          name: cleanWikiText(simpleMatch[1]),
          role: null,
        };
      }
      return null;
    })
    .filter(Boolean);
};

// Enhanced OTT release extraction
const extractOttRelease = (source) => {
  const patterns = [
    /digital[\s\S]*?rights[\s\S]*?(?:acquired by|bought by|sold to)\s*\[\[([^\]|]+)[^\]]*\]\]/i,
    /(?:Amazon Prime Video|Netflix|Disney\+ Hotstar|ZEE5|SonyLIV)/g,
    /satellite[\s\S]*?digital rights[\s\S]*?\[\[([^\]|]+)[^\]]*\]\]/i,
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) {
      return {
        platform: cleanWikiText(match[1] || match[0]),
        date: null, // You might want to extract the date if available
      };
    }
  }
  return null;
};

async function fetchWikipediaData(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/rest.php/v1/page/${encodeURIComponent(title)}`
    );
    if (!response.ok) {
      throw new Error("Wikipedia page not found");
    }
    const data = await response.json();
    const source = data.source;

    console.log(source, "source =====================================");

    // Extract Infobox section
    const infoboxMatch = source.match(/\{\{Infobox film([\s\S]*?)\}\}/);
    const infoboxContent = infoboxMatch ? infoboxMatch[1] : source;

    // Extract filming locations
    const filmingLocations =
      (source.match(/[Ff]ilming took place in ([^\.]+)/) || [])[1]
        ?.split(/,\s*/)
        .map((loc) => cleanWikiText(loc))
        .filter(Boolean) || [];

    const extractedData = {
      title: extractField(infoboxContent, "name") || data.title,
      language: extractField(infoboxContent, "language") || "Telugu",
      runtime: extractRuntime(infoboxContent) || "Unknown",
      budget: extractMoney(source, "budget"),
      boxOffice: extractMoney(source, "gross"),
      director: extractField(infoboxContent, "director"),
      producer: extractField(infoboxContent, "producer"),
      productionCompany: extractField(source, "studio") || "",
      music: extractField(source, "music") || extractField(source, "composer"),
      cinematography: extractField(source, "cinematography"),
      editing: extractField(source, "editing"),
      writer:
        source
          .match(/\|\s*writer\s*=\s*([^}]*?)(?=\||\})/s)?.[1]
          .split(/<br\s*\/?>/)
          .map((w) => cleanWikiText(w))
          .filter(Boolean) || [],
      cast: extractCast(source),
      filmingLocations,
      plot:
        cleanWikiText(
          (source.match(/==\s*Plot\s*==\s*\n([\s\S]*?)(?=\n==|$)/) || [])[1]
        ) || null,
      ottRelease: extractOttRelease(source),
    };

    return {
      ...extractedData,
      sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
        data.title
      )}`,
    };
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    const { movieId } = params;
    const moviesCollection = await getCollection("movies");
    const movie = await moviesCollection.findOne({
      _id: new ObjectId(movieId),
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const wikiData = await fetchWikipediaData(movie.title);

    const enrichedMovie = {
      _id: movie._id,
      key: movie.key || movie.title.replace(/\s+/g, "_"),
      title: movie.title,
      releaseDate: movie.releaseDate,
      releaseType: movie.releaseType || "THEATRICAL",
      language:
        movie.language || wikiData?.language?.replace(/\s+/g, "") || "Unknown",
      runtime: movie.runtime || wikiData?.runtime || "Unknown",
      country: movie.country || "India",
      director: movie.director || wikiData?.director,
      writer: movie.writer || wikiData?.writer || [],
      producer: wikiData?.producer,
      productionCompany: movie.productionCompany || wikiData?.productionCompany,
      cinematography: wikiData?.cinematography,
      editing: movie.editing || wikiData?.editing,
      music: movie.music || wikiData?.music,
      budget: movie.budget || wikiData?.budget,
      boxOffice: movie.boxOffice || wikiData?.boxOffice,
      cast: wikiData?.cast || [],
      filmingLocations:
        movie.filmingLocations || wikiData?.filmingLocations || [],
      plot: movie.plot || wikiData?.plot,
      ottRelease: movie.ottRelease || wikiData?.ottRelease || null,
      imageUrl: movie.imageUrl || "",
      license: {
        url: "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
        title: "Creative Commons Attribution-Share Alike 4.0",
      },
      sourceUrl: wikiData?.sourceUrl || "",
      latestUpdate: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(enrichedMovie);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
