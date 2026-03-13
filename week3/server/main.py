import httpx
from mcp.server.fastmcp import FastMCP

# Inisialisasi server FastMCP
# STDIO transport akan digunakan secara otomatis saat dijalankan sebagai script utama
mcp = FastMCP("Weather_MCP_Server")

BASE_URL = "https://api.open-meteo.com/v1/forecast"

@mcp.tool()
async def get_current_weather(latitude: float, longitude: float) -> str:
    """
    Get the current weather conditions for a specific latitude and longitude.
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,wind_speed_10m,weather_code",
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            if not current:
                return "Error: Could not retrieve current weather data."
                
            temp = current.get("temperature_2m")
            wind = current.get("wind_speed_10m")
            
            return f"Current weather at ({latitude}, {longitude}): Temperature is {temp}°C with wind speeds of {wind} km/h."
            
    except httpx.TimeoutException:
        return "Error: The weather API request timed out. Please try again later."
    except httpx.HTTPStatusError as e:
        return f"Error: Weather API returned an HTTP error: {e.response.status_code}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"

@mcp.tool()
async def get_weather_forecast(latitude: float, longitude: float, days: int = 3) -> str:
    """
    Get a daily weather forecast for a specific location for a given number of days (max 14).
    """
    # Membatasi request sesuai requirement API atau logic backoff
    if days > 14:
        days = 14
    elif days < 1:
        days = 1
        
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min",
        "timezone": "auto",
        "forecast_days": days
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            daily = data.get("daily", {})
            if not daily:
                return "Error: Could not retrieve daily forecast data."
                
            times = daily.get("time", [])
            max_temps = daily.get("temperature_2m_max", [])
            min_temps = daily.get("temperature_2m_min", [])
            
            result_lines = [f"Weather forecast for ({latitude}, {longitude}) for the next {days} days:"]
            for i in range(len(times)):
                result_lines.append(f"- {times[i]}: High {max_temps[i]}°C, Low {min_temps[i]}°C")
                
            return "\n".join(result_lines)
            
    except httpx.TimeoutException:
        return "Error: The weather API request timed out."
    except httpx.HTTPStatusError as e:
        return f"Error: Weather API returned an HTTP error: {e.response.status_code}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"

if __name__ == "__main__":
    # Menjalankan server menggunakan standard I/O (stdio)
    mcp.run()