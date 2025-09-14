package main

import (
	"devplaza/logger"
	"devplaza/middlewares"
	"devplaza/routes"
	"devplaza/scheduler"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func main() {
	// 初始化日志
	logFile := viper.GetString("log.file")
	logLevel := viper.GetString("log.level")
	logger.Init(logFile, logLevel)

	scheduler.StartScheduler()

	r := gin.Default()
	r.Use(middlewares.Cors())
	routes.SetupRouter(r)
	r.Run(":8080")
}
