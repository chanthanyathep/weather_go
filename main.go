package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	"github.com/spf13/viper"

	_ "github.com/go-sql-driver/mysql"
)

var db *sqlx.DB

func main() {
	initConfig()
	db = initDatabase()

	app := fiber.New()

	app.Get("/getAllWeather", getAllWeather)
	app.Post("/insertWeather", insertWeather)
	app.Put("/updateWeather", updateWeather)

	app.Static("/", "./wwwroot", fiber.Static{
		Index:         "index.html",
		CacheDuration: time.Second * 10,
	})
	app.Listen(viper.GetString("app.port"))
}

type Weather struct {
	Weather_id string `db:"weather_id" json:"weather_id"`
	Date       string `db:"day" json:"day"`
	Weather    string `db:"weather" json:"weather"`
	Sunrise    string `db:"sunrise" json:"sunrise"`
	Sunset     string `db:"sunset" json:"sunset"`
	Wind       string `db:"wind" json:"wind"`
	Temp       string `db:"temp" json:"temp"`
}

type WeatherRequest struct {
	Date    string `json:"day"`
	Weather string `json:"weather"`
	Sunrise string `json:"sunrise"`
	Sunset  string `json:"sunset"`
	Wind    string `json:"wind"`
	Temp    string `json:"temp"`
}

func getAllWeather(c *fiber.Ctx) error {
	weathers := []Weather{}
	query := "select * from weather"

	err := db.Select(&weathers, query)
	if err != nil {
		return err
	}
	return c.JSON(fiber.Map{
		"weathers": weathers,
	})
}

func getWeather(c *fiber.Ctx) error {
	weather := Weather{}
	weatherRequest := WeatherRequest{}
	err := c.BodyParser(&weatherRequest)
	if err != nil {
		return err
	}
	query := "select * from weather where day = ?"
	err = db.Get(&weather, query, weatherRequest.Date)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return c.JSON(fiber.Map{
		"weather": weather,
	})
}

func insertWeather(c *fiber.Ctx) error {
	weather := WeatherRequest{}
	err := c.BodyParser(&weather)
	if err != nil {
		return err
	}

	if weather.Date == "" || weather.Weather == "" || weather.Sunrise == "" || weather.Sunset == "" || weather.Wind == "" {
		return fiber.ErrUnprocessableEntity
	}

	query := "insert into weather(day,weather,sunrise,sunset,wind,temp) values (?,?,?,?,?,?)"
	_, err = db.Exec(query, weather.Date, weather.Weather, weather.Sunrise, weather.Sunset, weather.Wind, weather.Temp)
	if err != nil {
		return fiber.NewError(fiber.StatusUnprocessableEntity, err.Error())
	}
	w := Weather{
		Date:    weather.Date,
		Weather: weather.Weather,
		Sunrise: weather.Sunrise,
		Sunset:  weather.Sunset,
		Wind:    weather.Wind,
		Temp:    weather.Temp,
	}

	return c.Status(fiber.StatusCreated).JSON(w)
}

func updateWeather(c *fiber.Ctx) error {
	weather := Weather{}
	err := c.BodyParser(&weather)
	if err != nil {
		return err
	}
	query := "Update weather set day=?,weather=?,sunrise=?,sunset=?,wind=?,temp=? where weather_id = ?"

	_, err = db.Exec(query, weather.Date, weather.Weather, weather.Sunrise, weather.Sunset, weather.Wind, weather.Temp, weather.Weather_id)
	if err != nil {
		fmt.Println("error")
		return fiber.NewError(fiber.StatusUnprocessableEntity, err.Error())
	}
	w := Weather{
		Weather_id: weather.Weather_id,
		Date:       weather.Date,
		Weather:    weather.Weather,
		Sunrise:    weather.Sunrise,
		Sunset:     weather.Sunset,
		Wind:       weather.Wind,
		Temp:       weather.Temp,
	}

	return c.JSON(w)
}

func initConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
}

func initDatabase() *sqlx.DB {
	dsn := fmt.Sprintf("%v:%v@tcp(%v:%v)/%v",
		viper.GetString("db.username"),
		viper.GetString("db.password"),
		viper.GetString("db.host"),
		viper.GetInt("db.port"),
		viper.GetString("db.database"),
	)

	db, err := sqlx.Open(viper.GetString("db.driver"), dsn)
	if err != nil {
		panic(err)
	}
	db.SetConnMaxIdleTime(3 * time.Minute)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	return db
}
