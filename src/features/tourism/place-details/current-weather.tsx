"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, LoaderCircle, Snowflake, Sun, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { getCurrentTourismWeather } from "@/features/tourism/services/tourism-service";
import type { CurrentWeather } from "@/features/tourism/providers/tourism-provider";

type CurrentWeatherProps = { latitude?: number | null; longitude?: number | null };

export function CurrentWeather({ latitude, longitude }: CurrentWeatherProps) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      setIsLoading(false);
      return;
    }
    const weatherLatitude = latitude;
    const weatherLongitude = longitude;
    async function loadWeather() {
      setIsLoading(true);
      const result = await getCurrentTourismWeather(weatherLatitude, weatherLongitude);
      if (isActive) { setWeather(result); setIsLoading(false); }
    }
    void loadWeather();
    return () => { isActive = false; };
  }, [latitude, longitude]);

  return <Card className="border-primary/10 shadow-sm"><CardContent className="p-5 sm:p-6"><SectionHeader eyebrow="Conditions" title="Current Weather" />{isLoading ? <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" aria-hidden />Loading weather…</div> : weather ? <WeatherDetails weather={weather} /> : <p className="mt-5 text-sm leading-6 text-muted-foreground">Current weather is unavailable for this place right now. Please check again later.</p>}</CardContent></Card>;
}

function WeatherDetails({ weather }: { weather: CurrentWeather }) {
  const WeatherIcon = getWeatherIcon(weather.weatherCode);
  return <div className="mt-5"><div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary"><WeatherIcon className="size-7" aria-hidden /></div><div><p className="text-3xl font-semibold tracking-tight">{formatTemperature(weather.temperatureCelsius)}</p><p className="text-sm text-muted-foreground">{weather.condition}</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm text-muted-foreground"><p>Feels like <span className="font-medium text-foreground">{formatTemperature(weather.feelsLikeCelsius)}</span></p><p className="flex items-center gap-2"><Droplets className="size-4 text-primary" aria-hidden />{weather.humidityPercent}% humidity</p><p className="flex items-center gap-2"><Wind className="size-4 text-primary" aria-hidden />{weather.windSpeedKph} km/h wind</p></div><p className="mt-4 text-xs text-muted-foreground">Updated {formatUpdatedAt(weather.updatedAt)}</p></div>;
}

function getWeatherIcon(weatherCode: number) {
  if (weatherCode === 0) return Sun;
  if ([1, 2].includes(weatherCode)) return CloudSun;
  if (weatherCode === 3) return Cloud;
  if ([45, 48].includes(weatherCode)) return CloudFog;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return CloudRain;
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return Snowflake;
  if ([95, 96, 99].includes(weatherCode)) return CloudLightning;
  return Cloud;
}

function formatTemperature(value: number) { return `${Math.round(value)}°C`; }
function formatUpdatedAt(date: Date) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date); }
