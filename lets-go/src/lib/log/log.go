package log

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"runtime"

	"github.com/sirupsen/logrus"
)

var entry *logrus.Entry

type Logger struct {
	*logrus.Entry
}

func GetLogger() Logger {
	return Logger{entry}
}

type hook struct {
	Writer    []io.Writer
	LogLevels []logrus.Level
}

func (h *hook) Fire(entry *logrus.Entry) error {
	line, err := entry.Bytes()
	if err != nil {
		return err
	}

	for _, w := range h.Writer {
		if _, err = w.Write(line); err != nil {
			return err
		}
	}

	return nil
}

func (h *hook) Levels() []logrus.Level {
	return h.LogLevels
}

type pretty struct {
	file *os.File
}

func (s *pretty) Write(arr []byte) (int, error) {
	var log = string(arr)
	var r = regexp.MustCompile(`\033\[[0-9;]*m`)
	return s.file.Write([]byte(r.ReplaceAllString(log, "")))
}

const (
	LOG_DIR  = "./logs"
	LOG_FILE = "out.log"
)

func init() {
	l := logrus.New()
	l.SetReportCaller(true)
	l.SetFormatter(&logrus.TextFormatter{
		ForceColors:               true,
		EnvironmentOverrideColors: true,
		TimestampFormat:           "15:04:05  2 Jan 2006",
		FullTimestamp:             true,
		DisableLevelTruncation:    false,
		PadLevelText:              true,
		CallerPrettyfier: func(f *runtime.Frame) (function string, file string) {
			return "", fmt.Sprintf(" %s:%d", filepath.Base(f.File), f.Line)
		},
	})

	var err error
	if err = os.MkdirAll(LOG_DIR, 0755); err != nil || os.IsExist(err) {
		panic(fmt.Errorf("Failed on creating dir '%s' %v", LOG_DIR, err))
	}

	var file *os.File
	if file, err = os.OpenFile(filepath.Join(LOG_DIR, LOG_FILE), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0664); err != nil {
		panic(fmt.Errorf("Failed to open file'%s' %v", LOG_FILE, err))
	}

	// Send all logs to nowhere by default
	l.SetOutput(ioutil.Discard)
	l.AddHook(&hook{
		Writer:    []io.Writer{&pretty{file: file}, os.Stdout},
		LogLevels: logrus.AllLevels,
	})

	l.SetLevel(logrus.TraceLevel)
	entry = logrus.NewEntry(l)
}
