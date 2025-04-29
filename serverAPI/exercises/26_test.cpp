#include <gtest/gtest.h>
#include <iomanip>
#include <sstream>
#include <iostream>

class Data
{
public:
    int dia, mes, ano;
    void imprimir() const
    {
        std::cout << std::setw(2) << std::setfill('0') << dia << "/"
                  << std::setw(2) << std::setfill('0') << mes << "/"
                  << ano << std::endl;
    }
};

TEST(DataTest, ImprimeCorretamente)
{
    testing::internal::CaptureStdout();
    Data d;
    d.dia = 5;
    d.mes = 4;
    d.ano = 2025;
    d.imprimir();
    std::string saida = testing::internal::GetCapturedStdout();
    EXPECT_EQ(saida, "05/04/2025\n");
}
